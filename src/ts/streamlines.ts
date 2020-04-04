import * as log from 'loglevel';
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
}

export default class Streamlines {

    private domainController: DomainController = DomainController.getInstance();
    private majorGrid: GridStorage;
    private minorGrid: GridStorage;

    private paramsSq: StreamlineParams;

    /**
     * Uses world-space coordinates
     */
    constructor(private integrator: FieldIntegrator, private params: StreamlineParams) {
        if (params.dstep > params.dsep) {
            log.error("STREAMLINE SAMPLE DISTANCE BIGGER THAN DSEP");
        }

        this.majorGrid = new GridStorage(this.domainController.worldDimensions, this.domainController.origin, params.dsep);
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
            Math.random() * this.domainController.worldDimensions.x,
            Math.random() * this.domainController.worldDimensions.y)
            .add(this.domainController.origin);
    }

    delete(): Vector[][] {
        const streamlines: Vector[][] = [];
        for (let i = 0; i < 50; i++) {
            streamlines.push(this.createStreamline(this.samplePoint(), true));
        }
        for (let i = 0; i < 50; i++) {
            streamlines.push(this.createStreamline(this.samplePoint(), false));
        }
        return streamlines;
    }

    private streamlineIntegrationStep(major: boolean, params: StreamlineIntegration): void {
        params.streamline.push(params.previousPoint);
        const nextDirection = this.integrator.integrate(params.previousPoint, major);

        // Make sure we travel in the same direction
        if (nextDirection.dot(params.previousDirection) < 0) {
            nextDirection.negate();
        }

        params.previousDirection = nextDirection;
        params.previousPoint = params.previousPoint.clone().add(nextDirection);
    }

    /**
     * By simultaneously integrating in both directions we reduce the impact of circles not joining
     * up as the error matches at the join
     */
    createStreamline(seed: Vector, major: boolean): Vector[] {
        // TODO put this elsewhere
        this.setParamsSq();

        // TODO stopping conditions

        const streamlineForward = [seed];
        const streamlineBackward = [];

        let count = 0;
        let pointsEscaped = false;  // True once two integration fronts have moved dlookahead away

        let previousForwardDirection = this.integrator.integrate(seed, major);
        let previousBackwardDirection = previousForwardDirection.clone().negate();
        
        let previousForwardPoint = seed.clone().add(previousForwardDirection);
        let previousBackwardPoint = seed.clone().add(previousBackwardDirection);
 
        let validForwards = true;
        let validBackwards = true;

        while (count < this.params.pathIterations && (validForwards || validBackwards)) {
            if (validForwards) {
                streamlineForward.push(previousForwardPoint);
                const nextForwardDirection = this.integrator.integrate(previousForwardPoint, major);
                // Make sure we travel in the same direction
                if (nextForwardDirection.dot(previousForwardDirection) < 0) {
                    nextForwardDirection.negate();
                }
                previousForwardDirection = nextForwardDirection;
                previousForwardPoint = previousForwardPoint.clone().add(nextForwardDirection);
            }


            if (validBackwards) {
                streamlineBackward.push(previousBackwardPoint);
                const nextBackwardDirection = this.integrator.integrate(previousBackwardPoint, major);
                if (nextBackwardDirection.dot(previousBackwardDirection) < 0) {
                    nextBackwardDirection.negate();
                }
                previousBackwardDirection = nextBackwardDirection;
                previousBackwardPoint = previousBackwardPoint.clone().add(nextBackwardDirection);
            }

            // Join up circles
            const sqDistanceBetweenPoints = previousForwardPoint.distanceToSquared(previousBackwardPoint);

            if (!pointsEscaped && sqDistanceBetweenPoints >= this.paramsSq.dlookahead) {
                pointsEscaped = true;
            }

            if (pointsEscaped && sqDistanceBetweenPoints <= this.paramsSq.dlookahead) {
                streamlineForward.push(previousForwardPoint);
                streamlineForward.push(previousBackwardPoint);
                streamlineBackward.push(previousBackwardPoint);
                break;
            }

            count++;
        }

        return streamlineBackward.reverse().concat(streamlineForward);
    }
}
