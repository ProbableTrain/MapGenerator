import * as log from 'loglevel';
import * as simplify from 'simplify-js';
import Vector from './vector';
import GridStorage from './grid_storage';
import FieldIntegrator from './integrator';
import DomainController from './domain_controller';

interface StreamlineIntegration {
    streamline: Vector[];
    previousDirection: Vector;
    previousPoint: Vector;
    valid: boolean;
}

export interface StreamlineParams {
    [prop: string]: number,
    dsep: number;  // Streamline seed separating distance
    dtest: number;  // Streamline integration separating distance
    dstep: number;  // Step size
    dlookahead: number;  // How far to look ahead to join up
    pathIterations: number;  // Path integration iteration limit
    seedTries: number;  // Max failed seeds
    simplifyTolerance: number;
}

export default class Streamlines {

    private domainController: DomainController = DomainController.getInstance();
    private worldDimensions: Vector = this.domainController.worldDimensions.clone();
    private origin: Vector = this.domainController.origin.clone();
    private majorGrid: GridStorage;
    private minorGrid: GridStorage;
    private paramsSq: StreamlineParams;

    private candidateSeedsMajor: Vector[] = [];
    private candidateSeedsMinor: Vector[] = [];

    private streamlinesDone: boolean = true;
    private lastStreamlineMajor: boolean = true;

    public streamlinesMajor: Vector[][] = [];
    public streamlinesMinor: Vector[][] = [];
    public allStreamlinesSimple: Vector[][] = [];  // Reduced vertex count


    /**
     * Uses world-space coordinates
     */
    constructor(private integrator: FieldIntegrator, private params: StreamlineParams) {
        if (params.dstep > params.dsep) {
            log.error("STREAMLINE SAMPLE DISTANCE BIGGER THAN DSEP");
        }

        // Enforce test < sep
        params.dtest = Math.min(params.dtest, params.dsep);

        this.majorGrid = new GridStorage(this.worldDimensions, this.origin, params.dsep);
        this.minorGrid = new GridStorage(this.worldDimensions, this.origin, params.dsep);

        this.setParamsSq();
    }

    get allStreamlines(): Vector[][] {
        // Combine
        return this.streamlinesMajor.concat(this.streamlinesMinor);
    }

    update() {
        if (!this.streamlinesDone) {
            this.lastStreamlineMajor = !this.lastStreamlineMajor;
            if (!this.createStreamline(this.lastStreamlineMajor)) {
                this.streamlinesDone = true;
            }
        }
    }

    /**
     * Streamlines created each frame (animated)
     */
    createAllStreamlinesDynamic() {
        this.streamlinesDone = false;
    }

    /**
     * All at once - will freeze if dsep small
     */
    createAllStreamlines() {
        let major = true;
        while (this.createStreamline(major)) {
            major = !major;
        }
    }

    /**
     * Finds seed and creates a streamline from that point
     * Pushes new candidate seeds to queue
     * @return {Vector[]} returns false if seed isn't found within params.seedTries
     */
    private createStreamline(major: boolean): boolean {
        const seed = this.getSeed(major);
        if (seed === null) {
            return false;
        }
        const streamline = this.integrateStreamline(seed, major);
        if (this.validStreamline(streamline)) {
            this.grid(major).addPolyline(streamline);
            this.streamlines(major).push(streamline);

            this.allStreamlinesSimple.push(
                simplify(streamline, this.params.simplifyTolerance).map(point => new Vector(point.x, point.y)));

            // Add candidate seeds
            if (!streamline[0].equals(streamline[streamline.length - 1])) {
                this.candidateSeeds(!major).push(streamline[0]);
                this.candidateSeeds(!major).push(streamline[streamline.length - 1]);
            }
        }

        return true;
    }

    private validStreamline(s: Vector[]): boolean {
        return s.length > 5;
    } 

    private setParamsSq(): void {
        this.paramsSq = Object.assign({}, this.params);
        for (let p in this.paramsSq) {
            this.paramsSq[p] *= this.paramsSq[p];
        }
    }

    private samplePoint(): Vector {
        // TODO better seeding scheme
        return new Vector(
            Math.random() * this.worldDimensions.x,
            Math.random() * this.worldDimensions.y)
            .add(this.origin);
    }
 
    /**
     * Tries this.candidateSeeds first, then samples using this.samplePoint
     */
    private getSeed(major: boolean): Vector {
        // Candidate seeds first
        if (this.candidateSeeds(major).length > 0) {
            while (this.candidateSeeds(major).length > 0) {
                const seed = this.candidateSeeds(major).pop();
                if (this.grid(major).isValidSample(seed, this.paramsSq.dsep)) {
                    return seed;
                }
            }
        }

        let seed = this.samplePoint();
        let i = 0;
        while (!this.grid(major).isValidSample(seed, this.paramsSq.dsep)) {
            if (i >= this.params.seedTries) {
                return null;
            }
            seed = this.samplePoint();
            i++;
        }

        return seed;
    }

    // TODO enum to remove these functions
    private candidateSeeds(major: boolean): Vector[] {
        return major ? this.candidateSeedsMajor : this.candidateSeedsMinor;
    }

    private streamlines(major: boolean): Vector[][] {
        return major ? this.streamlinesMajor : this.streamlinesMinor;
    }

    private grid(major: boolean): GridStorage {
        return major ? this.majorGrid : this.minorGrid;
    }

    private pointInBounds(v: Vector): boolean {
        return (v.x >= this.origin.x
            && v.y >= this.origin.y
            && v.x < this.worldDimensions.x + this.origin.x
            && v.y < this.worldDimensions.y + this.origin.y
        );
    }

    /**
     * One step of the streamline integration process
     */
    private streamlineIntegrationStep(params: StreamlineIntegration, major: boolean): void {
        if (params.valid) {
            params.streamline.push(params.previousPoint);
            const nextDirection = this.integrator.integrate(params.previousPoint, major);

            // Make sure we travel in the same direction
            if (nextDirection.dot(params.previousDirection) < 0) {
                nextDirection.negate();
            }

            const nextPoint = params.previousPoint.clone().add(nextDirection);

            if (this.pointInBounds(nextPoint)
                && this.grid(major).isValidSample(nextPoint, this.paramsSq.dtest)) {
                params.previousPoint = nextPoint;
                params.previousDirection = nextDirection;
            } else {
                params.valid = false;
            }
        }
    }

    /**
     * By simultaneously integrating in both directions we reduce the impact of circles not joining
     * up as the error matches at the join
     */
    private integrateStreamline(seed: Vector, major: boolean): Vector[] {
        let count = 0;
        let pointsEscaped = false;  // True once two integration fronts have moved dlookahead away

        const d = this.integrator.integrate(seed, major);

        const forwardParams: StreamlineIntegration = {
            streamline: [seed],
            previousDirection: d,
            previousPoint: seed.clone().add(d),
            valid: true,
        }

        forwardParams.valid = this.pointInBounds(forwardParams.previousPoint);

        const backwardParams: StreamlineIntegration = {
            streamline: [],
            previousDirection: d.clone().negate(),
            previousPoint: seed.clone().add(d.clone().negate()),
            valid: true,
        }

        backwardParams.valid = this.pointInBounds(backwardParams.previousPoint);

        while (count < this.params.pathIterations && (forwardParams.valid || backwardParams.valid)) {
            this.streamlineIntegrationStep(forwardParams, major);
            this.streamlineIntegrationStep(backwardParams, major);

            // Join up circles
            const sqDistanceBetweenPoints = forwardParams.previousPoint.distanceToSquared(backwardParams.previousPoint);

            if (!pointsEscaped && sqDistanceBetweenPoints > this.paramsSq.dlookahead) {
                pointsEscaped = true;
            }

            if (pointsEscaped && sqDistanceBetweenPoints <= this.paramsSq.dlookahead) {
                forwardParams.streamline.push(forwardParams.previousPoint);
                forwardParams.streamline.push(backwardParams.previousPoint);
                backwardParams.streamline.push(backwardParams.previousPoint);
                break;
            }

            count++;
        }

        return backwardParams.streamline.reverse().concat(forwardParams.streamline);
    }
}
