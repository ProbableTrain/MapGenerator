import * as log from 'loglevel';
import * as simplify from 'simplify-js';
import Vector from '../vector';
import GridStorage from './grid_storage';
import FieldIntegrator from './integrator';

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
    dcirclejoin: number;  // How far to look to join circles - (e.g. 2 x dstep)
    dlookahead: number;  // How far to look ahead to join up dangling
    joinangle: number;  // Angle to join roads in radians
    pathIterations: number;  // Path integration iteration limit
    seedTries: number;  // Max failed seeds
    simplifyTolerance: number;
}

export default class StreamlineGenerator {
    private readonly SEED_AT_ENDPOINTS = false;

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
    constructor(private integrator: FieldIntegrator,
                private origin: Vector,
                private worldDimensions: Vector,
                private params: StreamlineParams) {
        if (params.dstep > params.dsep) {
            log.error("STREAMLINE SAMPLE DISTANCE BIGGER THAN DSEP");
        }

        // Enforce test < sep
        params.dtest = Math.min(params.dtest, params.dsep);

        this.majorGrid = new GridStorage(this.worldDimensions, this.origin, params.dsep);
        this.minorGrid = new GridStorage(this.worldDimensions, this.origin, params.dsep);

        this.setParamsSq();
    }

    clearStreamlines(): void {
        this.allStreamlinesSimple = [];
        this.streamlinesMajor = [];
        this.streamlinesMinor = [];
    }

    /**
     * Edits streamlines
     */
    joinDanglingStreamlines(): void { // TODO do in update method
        for (let major of [true, false]) {
            for (let streamline of this.streamlines(major)) {
                // Ignore circles
                if (streamline[0].equals(streamline[streamline.length - 1])) {
                    continue;
                }

                const newStart = this.getBestNextPoint(streamline[0], streamline[4], streamline)
                if (newStart !== null) {
                    this.pointsBetween(streamline[0], newStart, this.params.dstep).forEach(p => {
                        streamline.unshift(p);
                        this.grid(major).addSample(p);
                    });
                    streamline.unshift(newStart);
                }

                const newEnd = this.getBestNextPoint(streamline[streamline.length - 1], streamline[streamline.length - 4], streamline);
                if (newEnd !== null) {
                    this.pointsBetween(streamline[streamline.length - 1], newEnd, this.params.dstep).forEach(p => {
                        streamline.push(p);
                        this.grid(major).addSample(p);
                    });
                    streamline.push(newEnd);
                }
            }
        }

        // Reset simplified streamlines
        this.allStreamlinesSimple = this.allStreamlines.map(s => this.simplifyStreamline(s));
    }

    /**
     * Returns array of points from v1 to v2 such that they are separated by at most dsep
     * not including v1 or v2
     */
    pointsBetween(v1: Vector, v2: Vector, dstep: number): Vector[] {
        const d = v1.distanceTo(v2);
        const nPoints = Math.floor(d / dstep);
        if (nPoints === 0) return [];

        const stepVector = v2.clone().sub(v1).setLength(dstep);
        const out = [v1.clone().add(stepVector)];
        for (let i = 0; i < nPoints; i++) {
            out.push(out[out.length - 1].clone().add(stepVector));
        }
        return out;
    }


    /**
     * Gets next best point to join streamline
     * returns null if there are no good candidates
     */
    getBestNextPoint(point: Vector, previousPoint: Vector, streamline: Vector[]): Vector {
        const nearbyPoints = this.majorGrid.getNearbyPoints(point, this.params.dlookahead)
            .concat(this.minorGrid.getNearbyPoints(point, this.params.dlookahead));
        const direction = point.clone().sub(previousPoint);

        let closestSample = null;
        let closestDistance = Infinity;

        for (let sample of nearbyPoints) {
            if (!sample.equals(point) && !sample.equals(previousPoint) && !streamline.includes(sample)) {
                const differenceVector = sample.clone().sub(point);
                
                // Acute angle between vectors (agnostic of CW, ACW)
                const angleBetween = Math.abs(Vector.angleBetween(direction, differenceVector));
                const distanceToSample = point.distanceToSquared(sample);

                // Filter by angle
                if (angleBetween < this.params.joinangle && distanceToSample < closestDistance) {
                    closestDistance = distanceToSample;
                    closestSample = sample;
                }
            }
        }

        // TODO if trying to find intersections in the simplified graph
        // return closest.clone().add(direction length simplify tolerance));
        // to prevent ends getting pulled away from simplified lines
        return closestSample;
    }


    /**
     * Assumes s has already generated
     */
    addExistingStreamlines(s: StreamlineGenerator): void {
        this.majorGrid.addAll(s.majorGrid);
        this.minorGrid.addAll(s.minorGrid);
    }

    get allStreamlines(): Vector[][] {
        // Combine
        return this.streamlinesMajor.concat(this.streamlinesMinor);
    }

    update(): void {
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
    createAllStreamlinesDynamic(): void {
        this.streamlinesDone = false;
        // this.joinDanglingStreamlines();
    }

    /**
     * All at once - will freeze if dsep small
     */
    createAllStreamlines(): void {
        let major = true;
        while (this.createStreamline(major)) {
            major = !major;
        }
    }

    private simplifyStreamline(streamline: Vector[]): Vector[] {
        return simplify(streamline, this.params.simplifyTolerance).map(point => new Vector(point.x, point.y));
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

            this.allStreamlinesSimple.push(this.simplifyStreamline(streamline));

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
        if (this.SEED_AT_ENDPOINTS && this.candidateSeeds(major).length > 0) {
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
    private streamlineIntegrationStep(params: StreamlineIntegration, major: boolean, extraSamples: Vector[] =[]): void {
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

            if (!pointsEscaped && sqDistanceBetweenPoints > this.paramsSq.dcirclejoin) {
                pointsEscaped = true;
            }

            if (pointsEscaped && sqDistanceBetweenPoints <= this.paramsSq.dcirclejoin) {
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
