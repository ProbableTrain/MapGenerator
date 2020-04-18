import * as log from 'loglevel';
import * as PolyK from 'polyk';
import Vector from '../vector';
import * as jsts from 'jsts';

export default class PolygonUtil {
    private static geometryFactory = new jsts.geom.GeometryFactory();

    /**
     * Slices rectangle by line, returning largest polygon
     */
    public static sliceRectangle(origin: Vector, worldDimensions: Vector, p1: Vector, p2: Vector): Vector[] {
        const rectangle = [
            origin.x, origin.y,
            origin.x + worldDimensions.x, origin.y,
            origin.x + worldDimensions.x, origin.y + worldDimensions.y,
            origin.x, origin.y + worldDimensions.y,
        ];
        const sliced = PolyK.Slice(rectangle, p1.x, p1.y, p2.x, p2.y).map(p => PolygonUtil.polygonArrayToPolygon(p));
        const minArea = PolygonUtil.calcPolygonArea(sliced[0]);

        if (sliced.length > 1 && PolygonUtil.calcPolygonArea(sliced[1]) < minArea) {
            return sliced[1];
        } 
        return sliced[0];
    }

    public static calcPolygonArea(polygon: Vector[]): number {
        let total = 0;

        for (let i = 0; i < polygon.length; i++) {
          let addX = polygon[i].x;
          let addY = polygon[i == polygon.length - 1 ? 0 : i + 1].y;
          let subX = polygon[i == polygon.length - 1 ? 0 : i + 1].x;
          let subY = polygon[i].y;

          total += (addX * addY * 0.5);
          total -= (subX * subY * 0.5);
        }

        return Math.abs(total);
    }

    public static subdividePolygon(p: Vector[], minArea: number, maxAspectRatio: number): Vector[][] {
        const area = PolygonUtil.calcPolygonArea(p);
        if (area < minArea) {
            return [p];
        }

        let divided: Vector[][] = [];  // Array of polygons

        let longestSideLengthSq = 0;
        let longestSide = [p[0], p[1]];

        for (let i = 0; i < p.length; i++) {
            const sideLength = p[i].clone().sub(p[(i+1) % p.length]).lengthSq();  // TODO squared
            if (sideLength > longestSideLengthSq) {
                longestSideLengthSq = sideLength;
                longestSide = [p[i], p[(i+1) % p.length]];
            }
        }

        // Aspect ratio approximation
        // if (longestSideLengthSq / area >= maxAspectRatio) {  // Approximation
        //     return [];
        // }

        // Between 0.4 and 0.6
        const deviation = (Math.random() * 0.2) + 0.4;

        const averagePoint = longestSide[0].clone().add(longestSide[1]).multiplyScalar(deviation);
        const differenceVector = longestSide[0].clone().sub(longestSide[1]);
        const perpVector = (new Vector(differenceVector.y, -1 * differenceVector.x))
            .normalize()
            .multiplyScalar(100);

        const bisect = [averagePoint.clone().add(perpVector), averagePoint.clone().sub(perpVector)];

        // Array of polygons
        try {
            const sliced = PolyK.Slice(PolygonUtil.polygonToPolygonArray(p), bisect[0].x, bisect[0].y, bisect[1].x, bisect[1].y);
            // Recursive call
            for (const s of sliced) {
                divided.push(...PolygonUtil.subdividePolygon(PolygonUtil.polygonArrayToPolygon(s), minArea, maxAspectRatio));
            }

            return divided;
        } catch (error) {
            log.error(error);
            return [];
        }
    }

    public static resizeGeometry(geometry: Vector[], spacing: number, isPolygon=true): Vector[] {
        try {
            const jstsGeometry = isPolygon? PolygonUtil.polygonToJts(geometry) : PolygonUtil.lineToJts(geometry);
            const resized = jstsGeometry.buffer(spacing, undefined, undefined);
            if (!resized.isSimple()) {
                return [];
            }
            return resized.getCoordinates().map(c => new Vector(c.x, c.y));
        } catch (error) {
            log.error(error);
            return [];
        }
    }

    public static insidePolygon(point: Vector, polygon: Vector[]): boolean {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        if (polygon.length === 0) {
            return false;
        }

        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i].x, yi = polygon[i].y;
            var xj = polygon[j].x, yj = polygon[j].y;

            var intersect = ((yi > point.y) != (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    private static lineToJts(line: Vector[]): jsts.geom.LineString {
        const coords = line.map(v => new jsts.geom.Coordinate(v.x, v.y));
        return PolygonUtil.geometryFactory.createLineString(coords);
    }

    private static polygonToJts(polygon: Vector[]): jsts.geom.Polygon {
        const geoInput = polygon.map(v => new jsts.geom.Coordinate(v.x, v.y));
        geoInput.push(geoInput[0]);  // Create loop
        return PolygonUtil.geometryFactory.createPolygon(PolygonUtil.geometryFactory.createLinearRing(geoInput), []);
    }

    /**
     * [ v.x, v.y, v.x, v.y ]...
     */
    private static polygonToPolygonArray(p: Vector[]): number[] {
        const outP: number[] = [];
        for (const v of p) {
            outP.push(v.x);
            outP.push(v.y);
        }
        return outP;
    }

    /**
     * [ v.x, v.y, v.x, v.y ]...
     */
    private static polygonArrayToPolygon(p: number[]): Vector[] {
        const outP = [];
        for (let i = 0; i < p.length / 2; i++) {
            outP.push(new Vector(p[2*i], p[2*i + 1]));
        }
        return outP;
    }
}
