import * as Transform from "./transform.js";
import * as Mat from "./matmath.js";

window.onload = function () {
  main();
}

Array.prototype.clone = function() {
  return this.slice(0);
}

//Calculates the middle of the triangle
function median(vector, numVertices) {
  var median = [];
  for (var i = 0; i < numVertices; i++) {
    median[i] = 0;
    for (var j = 0; j < vector.length; j++) {
      median[i] += vector[j][i];
    };
    median[i] = median[i]/numVertices;
  };
  return median;
}

//Maps the new transformed shape from the original
function map(func, shape) {
  var newShape = [];
  shape.forEach(function (x) {
    newShape[newShape.length] = func(x);
  });
  return newShape;
}

//Checks if the dot product is less than 0
function isCulled(vector) {
  var x0 = vector[0][0];
  var x1 = vector[1][0];
  var x2 = vector[2][0];
  var y0 = vector[0][1];
  var y1 = vector[1][1];
  var y2 = vector[2][1];
  var z0 = vector[0][2];
  var z1 = vector[1][2];
  var z2 = vector[2][2];  
  var dot = x2*y1*z0-x1*y2*z0-x2*y0*z1+x0*y2*z1+x1*y0*z2-x0*y1*z2;
  return dot < 0;
}

var render = new Object();
var dragging;
var startingPosition;
var startingRotation;

function main() {
  render.canvas = document.getElementById("gl-canvas");
  render.indices = [2, 1, 0, 
                    3, 2, 0, 
                    6, 7, 4, 
                    5, 6, 4, 
                    5, 4, 0, 
                    1, 5, 0, 
                    6, 5, 1, 
                    2, 6, 1, 
                    7, 6, 2, 
                    3, 7, 2, 
                    3, 0, 4, 
                    7, 3, 4]
  render.vertices = [[-1, -1, 1], 
                     [-1, -1, -1], 
                     [1, -1, -1], 
                     [1, -1, 1], 
                     [-1, 1, 1], 
                     [-1, 1, -1], 
                     [1, 1, -1], 
                     [1, 1, 1]];
  render.rotation = [0,0,0];
  render.position = [0,0,0];
  render.init();

  //Clicks indicate the user might drag
  render.canvas.onmousedown = function(ev) { 
    dragging = true;
    startingPosition = [ev.clientX, ev.clientY];
    startingRotation = render.rotation.clone();
  }

  window.onmouseup = function(ev) {
    dragging = false;
  }

  window.requestAnimationFrame(update, render.canvas);
}

//The user is dragging the cube
window.onmousemove = function(ev) {
  if(dragging == true) {
    var drag_vector = [ev.clientX, ev.clientY].vecSubtract(startingPosition).vecScale(0.004);
    var rotation_x_old = render.rotation[0];
    render.rotation[1] = startingRotation[1] - drag_vector[0];
    render.rotation[0] = startingRotation[0] - drag_vector[1];
    if(Math.abs(render.rotation[0]) > Math.PI/2) {
      render.rotation[0] = rotation_x_old;
    }
  }
}

//Continuously loop
function update(){
  render.draw();
  window.requestAnimationFrame(update, render.canvas); 
}

//Initial values
render.init = function(){
  this.aspect = this.canvas.width/this.canvas.height;
  this.color = "black";
  this.indices = this.indices || [];
  this.vertices = this.vertices || [];
  this.position = [0,0,5];
  this.culledColor = "red";
  this.visibleColor = "white";
}

render.clear = function(){
  var context = this.canvas.getContext("2d");
  context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

//Puts vectors in clip space
render.clipSpace = function(v) {
  var d = 1;
  var np = 1;
  var fp = 10;
  var a = render.aspect;
  var x = v[0];
  var y = v[1];
  var z = v[2];
  var out = [d*x/(z*a), d*y/z, (z-np)/(fp-np)];
  return out;
};

//runs the object through the transformation matrices
render.transformObject = function(vector) {
  var RX = Transform.RotateX(render.rotation[0]);
  var RY = Transform.RotateY(render.rotation[1]);
  var RZ = Transform.RotateZ(render.rotation[2]);
  var T = Transform.Translate(render.position);
  var S = Transform.Scale(1);
  var M = T.matMultMat(S).matMultMat(RX).matMultMat(RY).matMultMat(RZ);
  return M.vecMultMat([vector[0], vector[1], vector[2], 1]);
};

//transforms vector from clip space to screen space
render.screenSpace = function(vector) {
  var width = render.canvas.width;
  var height = render.canvas.height;
  return [width/2 + vector[0]*width, height/2 - vector[1]*height, vector[2]];
};           

render.draw = function() {

  this.clear();

  var context = this.canvas.getContext("2d");
  context.strokeStyle = this.color;

  for (var i = 0; i < this.indices.length; i+=3) {
    var culled = false;
    var triangle = [this.vertices[this.indices[i]], this.vertices[this.indices[i+1]], this.vertices[this.indices[i+2]]];
 
    //transforms the triangles
    triangle = map(this.transformObject, triangle);

    //calculates marker position and puts it in screen space
    var marker;
    marker = median(triangle, 3);
    marker = this.screenSpace(this.clipSpace(marker));

    culled = !isCulled(triangle);
    
    //Put the triangle in clip space then screen space
    triangle = map(this.clipSpace, triangle);
    triangle = map(this.screenSpace, triangle);

    //draw the triangles
    var v1 = triangle[0];
    var v2 = triangle[1];
    var v3 = triangle[2]; 
    context.beginPath();
    context.moveTo(v1[0], v1[1]);
    context.lineTo(v2[0], v2[1]);
    context.lineTo(v3[0], v3[1]);
    context.lineTo(v1[0], v1[1]); 
    context.stroke();
    
    //draw markers
    context.fillStyle = culled ? this.culledColor : this.visibleColor;
    context.beginPath();
    context.arc(marker[0],marker[1],2,0*Math.PI,2*Math.PI);
    context.fill();
  };
}

//Vector subtraction
Array.prototype.vecSubtract = function(vectors) {
  var newVector = [];
  for (var i = 0; i < this.length; i++) {
    newVector[i] = this[i] - vectors[i];
  }
  return newVector;
};

//Vector Scale
Array.prototype.vecScale = function(scaleFactor) {
  return map(function(a) {return a*scaleFactor;}, this);
};

//Multiplies a vector by a matrix
Array.prototype.vecMultMat = function(matrix) { 
  return this.matMultMat([matrix].transpose()).transpose()[0];
};

//Matrix Multiplication
Array.prototype.matMultMat = function(matrix) {
  var newMatrix = [[]];
  var rows = Mat.numRows(this);
  var cols = Mat.numColumns(this);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      newMatrix[i] = newMatrix[i] || new Array(cols);
      newMatrix[i][j] = 0;
      for (var k = 0; k < rows; k++) {
        newMatrix[i][j] += this[i][k]*matrix[k][j];
      };
    };
  };
  return newMatrix;
};

//Get the transpose of the matrix
Array.prototype.transpose = function(matrix) {
  var rows = this.length;
  var cols = this[0].length;
  var transpose = [[]];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if(i==0) transpose[j] = [];
      transpose[j][i] = this[i][j];
    }
  }
  return transpose;
};
