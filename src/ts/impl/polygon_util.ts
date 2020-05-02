import * as log from 'loglevel';
import * as PolyK from 'polyk';
import Vector from '../vector';
import * as jsts from 'jsts';

export default class PolygonUtil {
    private static geometryFactory = new jsts.geom.GeometryFactory();

    /**
     * Slices rectangle by line, returning smallest polygon
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

    /**
     * Used to create sea polygon
     */
    public static lineRectanglePolygonIntersection(origin: Vector, worldDimensions: Vector, line: Vector[]): Vector[] {
        const jstsLine = PolygonUtil.lineToJts(line);
        const bounds = [
            origin,
            new Vector(origin.x + worldDimensions.x, origin.y),
            new Vector(origin.x + worldDimensions.x, origin.y + worldDimensions.y),
            new Vector(origin.x, origin.y + worldDimensions.y),
        ];
        const boundingPoly = PolygonUtil.polygonToJts(bounds);
        const union = boundingPoly.getExteriorRing().union(jstsLine);
        const polygonizer = new (jsts.operation as any).polygonize.Polygonizer();
        polygonizer.add(union);
        const polygons = polygonizer.getPolygons();

        let smallestArea = Infinity;
        let smallestPoly;
        for (let i = polygons.iterator(); i.hasNext();) {
            const polygon = i.next();
            const area = polygon.getArea();
            if (area < smallestArea) {
                smallestArea = area;
                smallestPoly = polygon;
            }
        }

        if (!smallestPoly) return [];
        return smallestPoly.getCoordinates().map((c: any) => new Vector(c.x, c.y));
    }

    public static calcPolygonArea(polygon: Vector[]): number {
        let total = 0;

        for (let i = 0; i < polygon.length; i++) {
          const addX = polygon[i].x;
          const addY = polygon[i == polygon.length - 1 ? 0 : i + 1].y;
          const subX = polygon[i == polygon.length - 1 ? 0 : i + 1].x;
          const subY = polygon[i].y;

          total += (addX * addY * 0.5);
          total -= (subX * subY * 0.5);
        }

        return Math.abs(total);
    }

    /**
     * Recursively divide a polygon by its longest side until the minArea stopping condition is met
     */
    public static subdividePolygon(p: Vector[], minArea: number): Vector[][] {
        const area = PolygonUtil.calcPolygonArea(p);
        if (area < 0.5 * minArea) {
            return [];
        }
        const divided: Vector[][] = [];  // Array of polygons

        let longestSideLength = 0;
        let longestSide = [p[0], p[1]];

        let perimeter = 0;

        for (let i = 0; i < p.length; i++) {
            const sideLength = p[i].clone().sub(p[(i+1) % p.length]).length();
            perimeter += sideLength;
            if (sideLength > longestSideLength) {
                longestSideLength = sideLength;
                longestSide = [p[i], p[(i+1) % p.length]];
            }
        }

        // Shape index
        // Using rectangle ratio of 1:4 as limit
        // if (area / perimeter * perimeter < 0.04) {
        if (area / (perimeter * perimeter) < 0.04) {
            return [];
        }

        if (area < 2 * minArea) {
            return [p];
        }

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
                divided.push(...PolygonUtil.subdividePolygon(PolygonUtil.polygonArrayToPolygon(s), minArea));
            }

            return divided;
        } catch (error) {
            log.error(error);
            return [];
        }
    }

    /**
     * Shrink or expand polygon
     */
    public static resizeGeometry(geometry: Vector[], spacing: number, isPolygon=true): Vector[] {
        try {
            const jstsGeometry = isPolygon? PolygonUtil.polygonToJts(geometry) : PolygonUtil.lineToJts(geometry);
            const resized = jstsGeometry.buffer(spacing, undefined, (jsts as any).operation.buffer.BufferParameters.CAP_FLAT);
            if (!resized.isSimple()) {
                return [];
            }
            return resized.getCoordinates().map(c => new Vector(c.x, c.y));
        } catch (error) {
            log.error(error);
            return [];
        }
    }

    public static averagePoint(polygon: Vector[]): Vector {
        if (polygon.length === 0) return Vector.zeroVector();
        const sum = Vector.zeroVector();
        for (const v of polygon) {
            sum.add(v);
        }
        return sum.divideScalar(polygon.length);
    }

    public static insidePolygon(point: Vector, polygon: Vector[]): boolean {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        if (polygon.length === 0) {
            return false;
        }

        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = ((yi > point.y) != (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    public static pointInRectangle(point: Vector, origin: Vector, dimensions: Vector): boolean {
        return point.x >= origin.x && point.y >= origin.y && point.x <= dimensions.x && point.y <= dimensions.y;
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
