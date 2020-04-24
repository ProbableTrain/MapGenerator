# Implementation Details

> This section is under construction

## High Level Overview

### Algorithm - Road Network

This generator is based on the paper '[Interactive Procedural Street Modeling](https://www.researchgate.net/publication/220183520_Interactive_Procedural_Street_Modeling)'. In general, code responsible for the generation algorithm lives in the `src/ts/impl` folder, whereas code responsible for putting it together and rendering it is under `src/ts/ui`.

| Grid | Radial | Combination | 
| :----------: |:------------:| :-----------:| 
| | Fields | |
| ![tensor-grid-field](images/implementation/tensor-grid-field.png ':size=200x200') | ![tensor-radial-field](images/implementation/tensor-radial-field.png ':size=200x200') | ![tensor-comb-field](images/implementation/tensor-comb-field.png ':size=200x200') |
| | Roads | |
| ![tensor-grid-road](images/implementation/tensor-grid-road.png ':size=200x200') | ![tensor-radial-road](images/implementation/tensor-radial-road.png ':size=200x200') | ![tensor-comb-road](images/implementation/tensor-comb-road.png ':size=200x200') |


#### Tensor Field

The tensor field in this case is essentially two vector fields which are perpendicular at any given point.

The tensor field used here associates a tensor with every point in 2D space. A tensor gives us two bidirectional, perpendicular vectors called the 'major' and 'minor' eigenvectors. Given a tensor (`src/ts/impl/tensor.ts`), we extract the two perpendicular vectors using the `getMajor` and `getMinor` methods.

A tensor field for the road network is created by smoothly combining grid and radial fields. See `src/ts/impl/basis_field.ts` for the representation of each basis field. `src/ts/impl/tensor_field.ts` is responsible for handling basis fields. It has a function `samplePoint`, which returns the tensor at that point in the field.

#### Streamlines

To create roads from the field, we integrate it, which is similar to tracing lines along the major and minor vector fields. Integrated lines are called streamlines, and the logic for handling streamlines is found in `src/ts/impl/streamlines.ts`. Integrators are found in `src/ts/impl/integrator.ts`, and RK4 is the integrator currently used. Given a starting point, we step in the direction of the major/minor vector by a distance `dstep` (configurable, found in the `road/params` folders in the GUI) using the `integrate` function in the integrator class. This process is repeated from the new point until a stopping condition is met e.g. reach the edge of the screen, hit an iteration limit, go around in a circle.

We make sure that streamlines are separated from each other by a configurable distance `dsep` (configurable in the GUI). `dsep` controls how dense the resultant road network is. `src/ts/impl/grid_storage` is responsible for enforcing this by making sure that any new point to be added to a streamline is `dsep` away from other streamlines.


### Buildings

To add buildings we need to know the location and shape of building lots. We have a list of streamlines, where each streamline is a list of vectors. This is fine for drawing but challenging for logic - we don't know where the intersections are. To generate lots, we first need to build a logical graph of the road network consisting of nodes and edges.

#### Graph

* **Simplify-js** - To reduce the number of vectors in each streamline they are first simplified using `simplify-js` so that the intersection algorithm runs faster
* **isect** - Intersections are found in the streamlines using the `isect` library
* **Graph** - A graph is built. It is made up of nodes, where each node has a position vector and a set of neighbor nodes. This is done in `src/ts/impl/graph.ts`.
* **Polygon Finding** - Polygons are found in the graph using a simple algorithm: for each node, trace a path turning right at each intersection until you reach a visited node. This is done in `src/ts/impl/polygon_finder.ts`.
* **Polygons to buildings** - These polygons are first shrunk in size, and then divided by their longest edge recursively to create buildings. This stage is still an area of development.


| Intersections | Polygons | Building lots | 
| :----------: |:------------:| :-----------:| 
| ![Graph](images/implementation/polygon-5.png ':size=200x200') | ![Graph](images/implementation/polygon-4.png ':size=200x200') | ![Graph](images/implementation/polygon-7.png ':size=200x200') |


### Rendering

Everything is put together in `src/ts/ui/main_gui.ts` and drawn on the canvas. 

<!-- - roughjs
- colour schemes
- pseudo3d  -->

## Detailed Overview



<!-- #### Latex test:


$R \begin{pmatrix}
cos(2 \theta)&sin(2 \theta) \\ 
sin(2 \theta)&-cos(2 \theta)
\end{pmatrix}$ -->

<!-- https://upupming.site/docsify-katex/docs/#/supported -->