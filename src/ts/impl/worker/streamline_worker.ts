import * as log from 'loglevel';
import Vector from '../../vector';
import TensorField from '../tensor_field';
import {StreamlineParams} from '../streamlines';
import StreamlineGenerator from '../streamlines';
import {RK4Integrator} from '../integrator';
import {StreamlineWorkerParams, isGrid, MessageType} from './worker_params';

function streamlinesFromParams(params: StreamlineWorkerParams): StreamlineGenerator {
    const field = new TensorField;
    params.fieldParams.forEach(fieldParams => {
        if (isGrid(fieldParams)) {
            field.addGrid(new Vector(fieldParams.centre.x, fieldParams.centre.y),
                fieldParams.size, fieldParams.decay, fieldParams.theta);
        } else {  // Radial
            field.addRadial(new Vector(fieldParams.centre.x, fieldParams.centre.y),
                fieldParams.size, fieldParams.decay);
        }
    });
    const integrator = new RK4Integrator(field, params.streamlinesParams.params);
    const origin = new Vector(params.streamlinesParams.origin.x, params.streamlinesParams.origin.y);
    const worldDimensions = new Vector(params.streamlinesParams.worldDimensions.x, params.streamlinesParams.worldDimensions.y);
    return new StreamlineGenerator(integrator, origin, worldDimensions, params.streamlinesParams.params);
}

module.exports = (self: any) => {
    self.addEventListener('message', (ev: any) => {
        switch(ev.data[0] as MessageType) {
            case MessageType.CreateMajorRoads: {
                const params: StreamlineWorkerParams = ev.data[1];
                self.s = streamlinesFromParams(params);
                self.s.createAllStreamlines();
                break;
            }
            case MessageType.GetMajorRoads: {
                if (self.s) {
                    self.postMessage(self.s.allStreamlinesSimpleParams);
                }
                break;
            }
        }
        // self.postMessage(s.allStreamlinesSimple);
        // setInterval(() => {
        //     self.postMessage(Vector.fromScalar(startNum));
        // }, 500);
    });
}
