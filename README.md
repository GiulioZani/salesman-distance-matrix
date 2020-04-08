# Salesman With Distance Matrix

Solves the travelling salesman problem. This is a fork from the [original](https://github.com/lovasoa/salesman.js/) project.
The only thig I added to it is the possibility of running the algorithm given a **distance matrix** as an input.

**Examples** 
```js
// Given a distance matrix.

//The nth column corresponds to the nth location.
//This matrix must be symmetric.
const distanceMatrix = [
  [0, 6661.9, 6680.2],
  [6661.9, 0, 18.3],
  [6680.2, 18.3, 0],
];
var solution = salesman.solve(distanceMatrix);
// solution now contains, at position n, location n's position in the optimized array.

// Given an array of points (taken from the original repository).
var points = [
      new salesman.Point(2,3)
      //other points
    ];
var solution = salesman.solve(points);
var ordered_points = solution.map(i => points[i]);
// ordered_points now contains the points, in the order they ought to be visited.
```
For more a more detail explanation and a demo see the [original repository](https://github.com/lovasoa/salesman.js/).
