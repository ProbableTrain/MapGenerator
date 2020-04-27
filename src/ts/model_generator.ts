import * as log from 'loglevel';
import * as THREE from 'three'
import OBJExporter from './OBJExporter';
import Vector from './vector';
import { CSG } from 'three-csg-ts';
import {BuildingModel} from './ui/buildings';

export default class ModelGenerator {
    private static readonly exporter = new OBJExporter();

    constructor() {
        // const groundPoly = [
        //     new Vector(0,0),
        //     new Vector(10,0),
        //     new Vector(10,10),
        //     new Vector(0,10),
        // ];

        // const ground = ModelGenerator.polygonToMesh(groundPoly, 5);

        // const riverPoly = [
        //     new Vector(2.5,0),
        //     new Vector(2.5,10),
        //     new Vector(7.5,10),
        //     new Vector(7.5,0),
        // ];

        // const river = ModelGenerator.polygonToMesh(riverPoly, 5);
        // river.position.add(new THREE.Vector3(0, 0, 2.5));

        // river.updateMatrix();
        // // meshB.updateMatrix();

        // // Create a bsp tree from each of the meshes
        // const bspA = CSG.fromMesh(ground);
        // const bspB = CSG.fromMesh(river);

        // // Subtract one bsp from the other via .subtract... other supported modes are .union and .intersect
        // const bspResult = bspA.subtract(bspB);

        // // Get the resulting mesh from the result bsp
        // const meshResult = CSG.toMesh(bspResult, ground.matrix);

        // this.download('model.obj', ModelGenerator.exporter.parse(meshResult));
    }

    public static getOBJ(ground: Vector[],
                         sea: Vector[],
                         coastline: Vector[],
                         river: Vector[],
                         mainRoads: Vector[][],
                         majorRoads: Vector[][],
                         minorRoads: Vector[][],
                         buildings: BuildingModel[],): any {
        const groundLevel = 20;
        const seaLevel = 14;
        const roadLevel = 18;

        // All arguments in screen space
        // -Z is up
        const groundMesh = ModelGenerator.polygonToMesh(ground, groundLevel);
        let groundBsp = CSG.fromMesh(groundMesh);

        // Subtract Ocean
        const seaMesh = ModelGenerator.polygonToMesh(sea, groundLevel);
        seaMesh.position.add(new THREE.Vector3(0, 0, -seaLevel));
        seaMesh.updateMatrix();
        const seaBsp = CSG.fromMesh(seaMesh);
        groundBsp = groundBsp.subtract(seaBsp);

        // Add coastline
        const coastlineMesh = ModelGenerator.polygonToMesh(coastline, groundLevel);
        const coastlineBsp = CSG.fromMesh(coastlineMesh);
        groundBsp = groundBsp.union(coastlineBsp);

        // Subtract Roads
        for (const road of minorRoads.concat(majorRoads).concat(mainRoads)) {
            if (road.length > 3) {
                const minorRoadsMesh = ModelGenerator.polygonToMesh(road, groundLevel);
                minorRoadsMesh.position.add(new THREE.Vector3(0, 0, -roadLevel));
                minorRoadsMesh.updateMatrix();
                const minorRoadsBsp = CSG.fromMesh(minorRoadsMesh);
                groundBsp = groundBsp.subtract(minorRoadsBsp);    
            }
        }

        // Subtract river
        const riverMesh = ModelGenerator.polygonToMesh(river, groundLevel);
        riverMesh.position.add(new THREE.Vector3(0, 0, -seaLevel));
        riverMesh.updateMatrix();
        const riverBsp = CSG.fromMesh(riverMesh);
        groundBsp = groundBsp.subtract(riverBsp);

        // Add bridges
        const bridgeHeight = (roadLevel - seaLevel) / 2;
        for (const road of majorRoads.concat(mainRoads)) {
            if (road.length > 3) {
                const minorRoadsMesh = ModelGenerator.polygonToMesh(road, bridgeHeight);
                minorRoadsMesh.position.add(new THREE.Vector3(0, 0, -(roadLevel - bridgeHeight)));
                minorRoadsMesh.updateMatrix();
                const minorRoadsBsp = CSG.fromMesh(minorRoadsMesh);
                groundBsp = groundBsp.union(minorRoadsBsp);
            }
        }

        const terrainMesh = CSG.toMesh(groundBsp, groundMesh.matrix);
        const cityGroup = new THREE.Group();
        cityGroup.add(terrainMesh);

        // Add buildings
        const buildingGroup = new THREE.Group();
        for (const b of buildings) {
            const buildingMesh = ModelGenerator.polygonToMesh(b.lotScreen, b.height);
            buildingGroup.add(buildingMesh);
        }

        buildingGroup.translateZ(-groundLevel);
        buildingGroup.updateMatrixWorld(true);
        cityGroup.add(buildingGroup);
        cityGroup.rotateX(Math.PI/2);
        cityGroup.scale.multiplyScalar(0.02);
        cityGroup.updateMatrixWorld(true);

        const obj = ModelGenerator.exporter.parse(cityGroup);

        for (const child of buildingGroup.children) {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
            }
        }
        terrainMesh.geometry.dispose();

        return obj;

    }

    private static polygonToMesh(polygon: Vector[], height: number): THREE.Mesh {
        if (polygon.length < 3) {
            log.error("Tried to export empty polygon as OBJ");
            return null;
        }
        const shape = new THREE.Shape();
        shape.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i < polygon.length; i++) {
            shape.lineTo(polygon[i].x, polygon[i].y);
        }
        shape.lineTo(polygon[0].x, polygon[0].y);

        const extrudeSettings = {
            steps: 3,
            depth: height,
            bevelEnabled: false,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geometry);
        mesh.translateZ(-height);
        mesh.updateMatrixWorld(true);
        return mesh;
    }
}
