//https://www.youtube.com/watch?v=W5gR_Kww2k8

const float PI = 3.1415926535897932384626433832795;
uniform vec3 uColor;
uniform vec3 uPosition;
uniform vec3 uRotation;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uMouse;


varying vec2 vUv;
varying float vElevation;
varying float vTime;

float pModPolar(inout vec2 p, float repetitions) {
    float angle = 2.*PI/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    float c = floor(a/angle);
    a = mod(a,angle) - angle/2.;
    p = vec2(cos(a), sin(a))*r;
    // For an odd number of repetitions, fix cell index of the cell in -x direction
    // (cell index would be e.g. -5 and 5 in the two halves of the cell):
    if (abs(c) >= (repetitions/2.)) c = abs(c);
    return c;
}



void main(){
  vec2 uv = vUv ;
  vec3 color = vec3(0.);
  float halfTime = vTime * .5;
  pModPolar(uv, 13.4 * sin(halfTime));
  float amount = 3.;
  float slantR =  uv.x + uv.y;
  float slantL = uv.x - uv.y ;
  vec3 terminal = vec3(0.29,0.965,0.149);
  vec3 cyan = vec3(0.,1.,1.) * slantR;

  vec3 thing = vec3(uv.x * uv.y) -uv.y * .2;

  vec3 grid = vec3(fract(slantR * amount + cos(uv.y + vTime)) * fract(slantL* amount) * .5 + sin(vTime));

 gl_FragColor = vec4(thing + (grid * terminal),.7);

}
