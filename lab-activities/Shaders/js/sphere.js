var canvas, gl;

var numTimesToSubdivide = 1;

var pointsArray = [];
var normalsArray = [];
var index = 0;

var va = vec3(0.0, 0.0, -1.0);
var vb = vec3(0.0, 0.942809, 0.333333);
var vc = vec3(-0.816497, -0.471405, 0.333333);
var vd = vec3(0.816497, -0.471405, 0.333333);

var material = {
  ambient: vec3(1.0, 0.0, 1.0),
  diffuse: vec3(1.0, 0.8, 0.0),
  specular: vec3(1.0, 1.0, 1.0),
  shininess: 100.0
};

var ambientIntensity = vec3(0.1, 0.1, 0.1);
var light = {
  position: vec3(1.0, 1.0, 1.0),
  intensity: vec3(1.0, 1.0, 1.0)
};

var radius = 3;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var fov = 60;
var aspect = 1;

var near = 0.01;
var far = 100;

//var left = -2.0;
//var right = 2.0;
//var ytop = 2.0;
//var bottom = -2.0;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var viewMatrixLoc, viewMatrix;
var projMatrixLoc, projMatrix = perspective(fov, aspect, near, far);
//var projMatrixLoc, projMatrix = ortho(left, right, bottom, ytop, near, far);

// build a tetrahedral approximation of a sphere
function tetrahedron(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}

/* ASCII art rendition of how divideTriangle works
      c
      .
      |\
      | \
   ac .--\. bc
      |\ |\
      | \| \
      .--.--. b
     a   ab
*/
function divideTriangle(a, b, c, count) {
  if (count > 0) {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    ab = normalize(ab);
    ac = normalize(ac);
    bc = normalize(bc);

    divideTriangle(a, ab, ac, count - 1);
    divideTriangle(ab, b, bc, count - 1);
    divideTriangle(bc, c, ac, count - 1);
    divideTriangle(ab, bc, ac, count - 1);
  } else {
    triangle(a, b, c);
  }
}

// build one face of the tetrahedral sphere
function triangle(a, b, c) {
  pointsArray.push(a);
  pointsArray.push(b);
  pointsArray.push(c);
  normalsArray.push(a);
  normalsArray.push(b);
  normalsArray.push(c);
  index += 3;
}

// initialize the page
window.onload = function init() {
  initFormControls();
  initScene();
}

// initialize the scene
function initScene() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

  initPipelineData();

  render();
}

// update and render the scene
function render() {
  // clear the frame buffer before drawing the next frame
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // recalculate the eye position
  eye = vec3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  );
  // update the camera matrix
  viewMatrix = lookAt(eye, at, up);

  // send the matrix data into the pipeline
  gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
  gl.uniformMatrix4fv(projMatrixLoc, false, flatten(projMatrix));

  // send a command stream to draw the triangles
  for (var i = 0; i < index; i += 3)
    gl.drawArrays(gl.TRIANGLES, i, 3);

  // queue up the next frame
  window.requestAnimationFrame(render);
}

// Load shaders and initialize attribute buffers and uniforms
function initPipelineData() {
  const program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // allocate new buffer, set as the active buffer, and copy normals data
  const nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  // look up the shader attribute and associate with the active buffer
  const vNormal = gl.getAttribLocation(program, "in_Normal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  // allocate new buffer, set as the active buffer, and copy positions data
  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  // look up the shader attribute and associate with the active buffer
  const vPosition = gl.getAttribLocation(program, "in_Position");
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // viewing matrices
  viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
  projMatrixLoc = gl.getUniformLocation(program, "projMatrix");

  // light source properties
  gl.uniform3fv(gl.getUniformLocation(program, "light.position"), flatten(light.position));
  gl.uniform3fv(gl.getUniformLocation(program, "light.intensity"), flatten(light.intensity));

  // ambien light intensity
  gl.uniform3fv(gl.getUniformLocation(program, "Ia"), flatten(ambientIntensity));

  // surface material properties
  gl.uniform3fv(gl.getUniformLocation(program, "ka"), flatten(material.ambient));
  gl.uniform3fv(gl.getUniformLocation(program, "kd"), flatten(material.diffuse));
  gl.uniform3fv(gl.getUniformLocation(program, "ks"), flatten(material.specular));
  gl.uniform1f(gl.getUniformLocation(program, "phongExp"), material.shininess);
}

// Set up the button event listeners to control the scene
function initFormControls() {
  document.getElementById("btnCamDistUp").addEventListener("click", () => radius *= 1.25);
  document.getElementById("btnCamDistDn").addEventListener("click", () => radius *= 0.8);
  document.getElementById("btnThetaUp").addEventListener("click", () => theta += dr);
  document.getElementById("btnThetaDn").addEventListener("click", () => theta -= dr);
  document.getElementById("btnPhiUp").addEventListener("click", () => phi += dr);
  document.getElementById("btnPhiDn").addEventListener("click", () => phi -= dr);
  document.getElementById("btnMoreDivs").addEventListener("click", () => {
    numTimesToSubdivide++;
    index = 0;
    pointsArray = [];
    normalsArray = [];
    initScene();
  });
  document.getElementById("btnLessDivs").addEventListener("click", () => {
    if (numTimesToSubdivide) numTimesToSubdivide--;
    index = 0;
    pointsArray = [];
    normalsArray = [];
    initScene();
  });
}
