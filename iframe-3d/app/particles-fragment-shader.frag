void main () {
  float a = mix(0.0, 1.0, step(distance(gl_PointCoord, vec2(0.5)), 0.5));
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}