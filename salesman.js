/**
 * @module
 * @author Giulio Zani
 * salesman npm module
 *
 * Good heuristic for the traveling salesman problem using simulated annealing.
 **/

/**
 * @private
 */
function Path() {}

function PathFromDistanceMatrix(distanceMatrix) {
  this.__proto__ = Path.prototype;
  this.order = new Array(distanceMatrix.length);
  for (var i = 0; i < distanceMatrix.length; i++) this.order[i] = i;
  this.distances = new Array(distanceMatrix.length * distanceMatrix.length);
  this.length = distanceMatrix.length;
  this.distanceMatrix = distanceMatrix;
  for (var i = 0; i < distanceMatrix.length; i++)
    for (var j = 0; j < distanceMatrix.length; j++)
      this.distances[j + i * distanceMatrix.length] = distanceMatrix[i][j];
}
function PathFromPoints(points) {
  this.__proto__ = Path.prototype;
  this.points = points;
  this.order = new Array(points.length);
  this.length = points.length;
  for (var i = 0; i < points.length; i++) this.order[i] = i;
  this.distances = new Array(points.length * points.length);
  for (var i = 0; i < points.length; i++)
    for (var j = 0; j < points.length; j++)
      this.distances[j + i * points.length] = distance(points[i], points[j]);
}
Path.prototype.change = function (temp) {
  var i = this.randomPos(),
    j = this.randomPos();
  var delta = this.delta_distance(i, j);
  if (delta < 0 || Math.random() < Math.exp(-delta / temp)) {
    this.swap(i, j);
  }
};
Path.prototype.size = function () {
  var s = 0;
  for (var i = 0; i < this.length; i++) {
    s += this.distance(i, (i + 1) % this.length);
  }
  return s;
};
Path.prototype.swap = function (i, j) {
  var tmp = this.order[i];
  this.order[i] = this.order[j];
  this.order[j] = tmp;
};
Path.prototype.delta_distance = function (i, j) {
  var jm1 = this.index(j - 1),
    jp1 = this.index(j + 1),
    im1 = this.index(i - 1),
    ip1 = this.index(i + 1);
  var s =
    this.distance(jm1, i) +
    this.distance(i, jp1) +
    this.distance(im1, j) +
    this.distance(j, ip1) -
    this.distance(im1, i) -
    this.distance(i, ip1) -
    this.distance(jm1, j) -
    this.distance(j, jp1);

  if (jm1 === i || jp1 === i) s += 2 * this.distance(i, j);
  return s;
};
Path.prototype.index = function (i) {
  return (i + this.length) % this.length;
};
Path.prototype.access = function (i) {
  return this.points[this.order[this.index(i)]];
};
Path.prototype.distance = function (i, j) {
  return this.distances[this.order[i] * this.length + this.order[j]];
};
// Random index between 1 and the last position in the array of points
Path.prototype.randomPos = function () {
  return 1 + Math.floor(Math.random() * (this.length - 1));
};

Path.prototype.temperature = function () {
  if (this.distanceMatrix) {
    return (
      100 *
      this.distanceMatrix[this.order[this.index(0)]][this.order[this.index(1)]]
    );
  } else {
    return 100 * this.distance(this.access(0), this.access(1));
  }
};
/**
 * Solves the following problem:
 *  Given a list of points and the distances between each pair of points,
 *  what is the shortest possible route that visits each point exactly
 *  once and returns to the origin point?
 *
 * @param {Point[]} points The points that the path will have to visit.
 * @param {Number} [temp_coeff=0.999] changes the convergence speed of the algorithm: the closer to 1, the slower the algorithm and the better the solutions.
 * @param {Function} [callback=] An optional callback to be called after each iteration.
 *
 * @returns {Number[]} An array of indexes in the original array. Indicates in which order the different points are visited.
 *
 * @example
 * var points = [
 *       new salesman.Point(2,3)
 *       //other points
 *     ];
 * var solution = salesman.solve(points);
 * var ordered_points = solution.map(i => points[i]);
 * // ordered_points now contains the points, in the order they ought to be visited.
 **/
function solve(input, temp_coeff, callback) {
  if (input[0] instanceof Point) {
    const points = input;
    const path = new PathFromPoints(points);
    if (points.length < 2) return path.order; // There is nothing to optimize
  } else {
    const distanceMatrix = input;
    var path = new PathFromDistanceMatrix(distanceMatrix);
    if (distanceMatrix.length < 2) return path.order; // There is nothing to optimize
  }
  var has_callback = typeof callback === "function";
  if (!temp_coeff)
    temp_coeff = 1 - Math.exp(-10 - Math.min(path.length, 1e6) / 1e5);
  for (
    var temperature = path.temperature();
    temperature > 1e-6;
    temperature *= temp_coeff
  ) {
    path.change(temperature);
    if (has_callback) callback(path.order);
  }
  return path.order;
}

/**
 * Represents a point in two dimensions.
 * @class
 * @param {Number} x abscissa
 * @param {Number} y ordinate
 */
function Point(x, y) {
  this.x = x;
  this.y = y;
}

function distance(p, q) {
  var dx = p.x - q.x,
    dy = p.y - q.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const result = solve([
  [0, 6661.9, 6680.2],
  [6661.9, 0, 18.3],
  [6680.2, 18.3, 0],
]);
export { solve, Point };
