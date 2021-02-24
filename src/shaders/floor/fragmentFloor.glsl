//https://www.youtube.com/watch?v=W5gR_Kww2k8

const float PI = 3.1415926535897932384626433832795;
uniform vec3 uColor;
uniform vec3 uPosition;
uniform vec3 uRotation;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uCount;

varying vec2 vUv;
varying float vElevation;
varying float vTime;

float circleDF(vec2 uv){
  vec2 centerPt = vec2(.5) - uv;
  float dist = length(centerPt);
  return dist;
}

vec3 cosPalette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

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

  vec2 uv = vUv;
  pModPolar(uv, uCount);
  vec3 color = vec3(0.);
  vec3 terminal = vec3(0.29,0.965,0.149);
  vec3 cyan = vec3(0.,1.,1.);


  float amount = 7.;
  float slantR = uv.x + uv.y ;
  float slantL = uv.x - uv.y ;

  float tau = PI * 2.;
  tau+= sin(vTime) * 2.;
  float t = vTime * .125;

  // slantL+= tau * 0.05;





  vec3 grid = vec3(
      fract(slantR * amount) +
      fract(slantL* amount));



  vec3 gradient = mix(terminal, cyan, grid);
  color+=gradient;




  vec3 cPalette = cosPalette( 0.5,
      color  , //brightness
      vec3(.0), //contrast
      vec3(.5), // osc
      vec3(.5, .5, 1.)  // phase
      );

 gl_FragColor = vec4(cPalette,0.8);

}
