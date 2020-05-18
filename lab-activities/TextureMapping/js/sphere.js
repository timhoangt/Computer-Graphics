/* Perspective projection  */
window.onload = function () {
  initFormControls();
  main();
}

/* Globals */
var gl, buffers;

/* Surface properties */
var material = {
  ambient: [0.2, 0.0, 0.2],
  diffuse: [1.0, 0.8, 0.0],
  specular: [1.0, 1.0, 1.0],
  shininess: 100.0
};

/* Lighting properties */
var ambientIntensity = [0.5, 0.5, 0.5];
var light = {
  position: [5.0, 0.0, 3.0],
  intensity: [1.0, 1.0, 1.0]
};

/* Camera parameters */
var camera = {
  fov: 60 * Math.PI / 180,
  aspect: 1,
  near: 0.01,
  far: 100,
  theta: Math.PI / 2.0,
  phi: 0.0,
  radius: 3,
  dr: 5.0 * Math.PI / 180.0
};

/* Perspective projection  */
var projMatrix = mat4.create();
mat4.perspective(projMatrix, camera.fov, camera.aspect, camera.near, camera.far);

/* Main program */
function main() {
  const canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  buffers = initBuffers(gl, document.getElementById("sliderSubdivide").value);

  const programInfo = buildShaderProgram(gl);

  const textures = [
    loadTexture(gl, 'textures/earth.png'), // diffuse color map
    loadTexture(gl, 'textures/earth-night.png'), // ambient color map
    loadTexture(gl, 'textures/earth-specular.png') // specular color and gloss map
  ];

  const then = 0;

  function render(now) {
    const deltaTime = then - now * 0.0001;
    drawScene(gl, programInfo, buffers, textures, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/* Update and render the scene */
function drawScene(gl, programInfo, buffers, textures, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Recalculate the eye position and update camera matrix

  const eye = [
    camera.radius * Math.sin(camera.theta) * Math.sin(camera.phi),
    camera.radius * Math.cos(camera.theta),
    camera.radius * Math.sin(camera.theta) * Math.cos(camera.phi)
  ];

  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, eye, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

  // Bind vertexPosition attribute to position buffer
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);
  }

  // Bind vertexNormal attribute to normal buffer
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexNormal);
  }

  // Bind textureCoord attribute to textureCoord buffer
  {
    /* TODO #11 Follow the examples of the position and normal
        buffers to set up the texture coordinates buffer.
        Be sure to specify the correct number of components.
        Also be sure to use the correct variable names from the
        buffers and the shader program's attribute locations. */
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.textureCoord);
  }
  gl.useProgram(programInfo.program);

  // Pass lighting data into pipeline
  gl.uniform3fv(programInfo.uniformLocations.lightPosition, new Float32Array(light.position));
  gl.uniform3fv(programInfo.uniformLocations.lightIntensity, new Float32Array(light.intensity));
  gl.uniform3fv(programInfo.uniformLocations.ambientIntensity, new Float32Array(ambientIntensity));

  // Pass surface material data into pipeline
  gl.uniform3fv(programInfo.uniformLocations.materialAmbient, new Float32Array(material.ambient));
  gl.uniform3fv(programInfo.uniformLocations.materialDiffuse, new Float32Array(material.diffuse));
  gl.uniform3fv(programInfo.uniformLocations.materialSpecular, new Float32Array(material.specular));
  gl.uniform1f(programInfo.uniformLocations.materialShininess, material.shininess);
  gl.uniform1f(programInfo.uniformLocations.time, deltaTime);

  // Pass matrix data into pipeline
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, new Float32Array(viewMatrix));
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, new Float32Array(projMatrix));

  // Assign textures to sampler objects
  /* TODO #8 Bind texture #0 to diffuse color map and copy to sampler. */
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[0]);
  gl.uniform1i(programInfo.uniformLocations.diffuseSampler, 0);
  /* TODO (Optional) Bind texture #1 to ambient map and copy to sampler. */
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, textures[1]);
  gl.uniform1i(programInfo.uniformLocations.ambientSampler, 0);
  /* TODO (Optional) Bind texture #2 to specular map and copy to sampler. */
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, textures[2]);
  gl.uniform1i(programInfo.uniformLocations.specularSampler, 0);

  // Send command stream to draw the triangles
  for (var i = 0; i < buffers.size; i += 3)
    gl.drawArrays(gl.TRIANGLES, i, 3);
}

/* Build geometry and initialize graphics buffer objects */
function initBuffers(gl, numSubdivisions) {
  const arrays = tetrahedron(numSubdivisions);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.points), gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.normals), gl.STATIC_DRAW);

  /* TODO #9 Create and populate the texture coordinates buffer object. */
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.texCoords), gl.STATIC_DRAW);


  return {
    position: positionBuffer,
    normal: normalBuffer,
    /* TODO #10 Add the texture coordinates buffer to this object. */
    textureCoord: textureCoordBuffer,
    size: arrays.points.length / 3
  };
}

/* Define our shaders and initialize the shader program. */
function buildShaderProgram(gl) {
  const vsSource = `#version 300 es
    precision mediump float;

    in vec3 in_Position;
    in vec3 in_Normal;
    /* TODO #1 Declare texture coords input from application. */
    in vec2 in_TextureCoord;

    out vec4 normal;
    out vec3 halfway;
    out vec3 lightdir;
    /* TODO #2 Declare texture coords output to frag shader. */
    out vec2 textureCoord;

    struct LightData {
      vec3 position;
      vec3 intensity;
    };
    uniform LightData light;

    uniform mat4 projMatrix;
    uniform mat4 viewMatrix;
    uniform float time;

    // declare helper functions for modeling transformation
    mat3 axisTilt(float);
    mat3 spinOnAxis(float, float);

    void main() {
      mat4 modelTransform = mat4(spinOnAxis(time, 23.5));
      vec4 pos = viewMatrix * modelTransform * vec4(in_Position, 1.0);
      vec4 lightPos = viewMatrix * vec4(light.position, 1.0);

      mat4 normalMatrix = transpose(inverse(viewMatrix * modelTransform));
      normal = normalMatrix * vec4(in_Normal, 0.0);

      vec3 v = normalize( -pos.xyz );
      lightdir = normalize( lightPos.xyz - pos.xyz );
      halfway = normalize( v + lightdir );

      /* TODO #3 Copy input texture coords to output. */
      textureCoord = in_TextureCoord;

      gl_Position = projMatrix * pos;
    }

    // define helper functions

    mat3 axisTilt(float deg) {
      return mat3(
        cos(radians(deg)), -sin(radians(deg)), 0,
        sin(radians(deg)), cos(radians(deg)), 0,
        0, 0, 1
      );
    }

    mat3 spinOnAxis(float t, float tilt) {
      return axisTilt(tilt) * mat3(
        cos(t), 0, sin(t),
        0, 1, 0,
        -sin(t), 0, cos(t)
      );
    }
  `;

  const fsSource = `#version 300 es
    precision mediump float;

    in vec4 normal;
    in vec3 halfway;
    in vec3 lightdir;
    /* TODO #4 Declare texture coords input from vertex shader. */
    in vec2 textureCoord;

    out vec4 fragmentColor;

    struct LightData {
      vec3 position;
      vec3 intensity;
    };
    uniform LightData light;

    uniform vec3 Ia;

    struct MaterialData {
      vec3 ka;
      vec3 kd;
      vec3 ks;
      float phongExp;
    };
    uniform MaterialData material;

    /* TODO #5 Declare 2D sampler for diffuse color. */
    uniform sampler2D diffuseSampler;
    /* TODO (Optional) declare 2D sampler for ambient color */
    uniform sampler2D ambientSampler;
    /* TODO (Optional) declare 2D sampler for specular color */
    uniform sampler2D specularSampler;

    void main() {
      vec3 n = normalize(normal.xyz);
      vec3 h = normalize(halfway);
      vec3 l = normalize(lightdir);

      // Here be sure to use the name(s) you chose for the sampler(s)
      vec4 diffuseTexel = texture(diffuseSampler, textureCoord)/* TODO #12 Look up texel using texture coords. */;
      vec4 ambientTexel = texture(ambientSampler, textureCoord)/* TODO (Optional) Look up ambient texel using texture coords. */;
      vec4 specularTexel = texture(specularSampler, textureCoord)/* TODO (Optional) Look up specular texel using texture coords. */;

      /* TODO (Optional) Replace the material ambient color with the ambient texel.
          Note that we only need RGB components here. */
      vec3 intensity = material.ka * Ia
        /* TODO #13 Replace material diffuse color with diffuse texel color.
          Note that we only need RGB components here. */
        + diffuseTexel.rgb * light.intensity * max( 0.0, dot(n, l) )
        /* TODO (Optional) Replace the material specular color with the specular texel.
            Note that we only need RGB components here. */
        /* TODO (Optional) Replace Phong exponent with specular texel alpha. */
        + material.ks * light.intensity * pow( max( 0.0, dot(n, h) ), material.phongExp );

      fragmentColor = vec4( intensity, 1.0 );
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "in_Position"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "in_Normal"),
      /* TODO #6 Look up shader variable for texture coords attribute */
      textureCoord: gl.getAttribLocation(shaderProgram, 'in_TextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "projMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "viewMatrix"),
      time: gl.getUniformLocation(shaderProgram, "time"),
      lightPosition: gl.getUniformLocation(shaderProgram, "light.position"),
      lightIntensity: gl.getUniformLocation(shaderProgram, "light.intensity"),
      ambientIntensity: gl.getUniformLocation(shaderProgram, "Ia"),
      materialAmbient: gl.getUniformLocation(shaderProgram, "material.ka"),
      materialDiffuse: gl.getUniformLocation(shaderProgram, "material.kd"),
      materialSpecular: gl.getUniformLocation(shaderProgram, "material.ks"),
      materialShininess: gl.getUniformLocation(shaderProgram, "material.phongExp"),
      /* TODO #7 Look up shader uniform for diffuse sampler. */
      diffuseSampler: gl.getUniformLocation(shaderProgram, 'diffuseSampler'),
      /* TODO (Optional) Look up shader uniform for ambient sampler. */
      ambientSampler: gl.getUniformLocation(shaderProgram, 'ambientSampler'),
      /* TODO (Optional) Look up shader uniform for specular sampler. */
      specularSampler: gl.getUniformLocation(shaderProgram, 'specularSampler'),
    },
  };
}

/* Build a tetrahedral approximation of a sphere */
function tetrahedron(n) {
  const points = [];
  const texCoords = [];

  const a = [0.0, 0.0, -1.0];
  const b = [0.0, 0.942809, 0.333333];
  const c = [-0.816497, -0.471405, 0.333333];
  const d = [0.816497, -0.471405, 0.333333];

  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);

  return {
    points: points,
    normals: points,
    texCoords: texCoords
  };

  function divideTriangle(a, b, c, count) {
    if (count-- > 0) {
      let ab = [];
      vec3.lerp(ab, a, b, 0.5);
      vec3.normalize(ab, ab);
      let ac = [];
      vec3.lerp(ac, a, c, 0.5);
      vec3.normalize(ac, ac);
      let bc = [];
      vec3.lerp(bc, b, c, 0.5);
      vec3.normalize(bc, bc);

      divideTriangle(a, ab, ac, count);
      divideTriangle(ab, b, bc, count);
      divideTriangle(bc, c, ac, count);
      divideTriangle(ab, bc, ac, count);
    } else {
      triangle(a, b, c);
    }
  }

  function triangle(a, b, c) {
    points.push(...a);
    points.push(...b);
    points.push(...c);

    const uva = worldToSpherical(a);
    const uvb = worldToSpherical(b);
    const uvc = worldToSpherical(c);
    /* TODO (Optional) get rid of the seam by checking if this
        triangle crosses the s-coordinate's 1-to-0 boundary, and
        if so then push the lower coordinates 1 unit to the right */
    texCoords.push(...uva);
    texCoords.push(...uvb);
    texCoords.push(...uvc);
  }

  /* TODO #14 Implement the spherical mapping for texture coordinates. */
  function worldToSpherical(p) {
    const s = (Math.atan2(p[0],p[2]) + Math.PI) / (2 * Math.PI) /* TODO how do we find s from x,y,z? */ ;
    const t = (Math.asin(p[1]) + (Math.PI/2)) / Math.PI /* TODO how do we find t from x,y,z? */ ;
    return [s, t];
  }
}

/* Initialize a shader program, so WebGL knows how to draw our data */
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

/* Create shader of the given type, upload the source and compile it. */
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/* Initialize a texture, load an image then copy it into the texture. */
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([8, 8, 8, 255]); // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
    width, height, border, srcFormat, srcType,
    pixel);

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      srcFormat, srcType, image);
    // We're using WebGL 2.0 so no need to check power-of-two
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  image.src = url;

  return texture;
}

/* Set up event listeners to control the scene */
function initFormControls() {
  document.getElementById("btnCamDistUp").addEventListener("click", () => camera.radius *= 1.25);
  document.getElementById("btnCamDistDn").addEventListener("click", () => camera.radius *= 0.8);
  document.getElementById("btnThetaUp").addEventListener("click", () => camera.theta -= camera.dr);
  document.getElementById("btnThetaDn").addEventListener("click", () => camera.theta += camera.dr);
  document.getElementById("btnPhiUp").addEventListener("click", () => camera.phi += camera.dr);
  document.getElementById("btnPhiDn").addEventListener("click", () => camera.phi -= camera.dr);
  document.getElementById("sliderSubdivide")
    .addEventListener("input", (evt) => {
      buffers = initBuffers(gl, evt.target.value);
    });
}
