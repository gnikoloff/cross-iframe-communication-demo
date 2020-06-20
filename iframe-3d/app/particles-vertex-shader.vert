#pragma glslify: curlNoise = require(./curl-noise.glsl)

uniform float time;

void main () {
  vec3 newPosition = position + curlNoise(position * 0.01 + time * 0.00001) * 100.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  gl_PointSize = 2.0;
}