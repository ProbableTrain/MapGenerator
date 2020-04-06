import Vector from '../../vector';
import {StreamlineParams} from '../streamlines';

export enum MessageType {
    GetMajorRoads,
    CreateMajorRoads,
}

// Only cloneable objects can be passed to/from worker
export interface WorkerObject {
    getWorkerParams: () => any;
}

export interface BasisFieldParams {
    centre: Vector;
    size: number;
    decay: number;
}

export interface GridParams extends BasisFieldParams {
    theta: number;
}

export function isGrid(fieldParams: GridParams | BasisFieldParams): fieldParams is GridParams {
    return (fieldParams as GridParams).theta !== undefined;
}

export interface VectorParams {
    x: number;
    y: number;
}

export interface StreamlinesParams {
    origin: VectorParams;
    worldDimensions: VectorParams;
    params: StreamlineParams;
}

export interface StreamlineWorkerParams {
    fieldParams: BasisFieldParams[];
    streamlinesParams: StreamlinesParams;
}
