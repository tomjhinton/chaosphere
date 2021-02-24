import './style.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


import vertexShaderBall from './shaders/ball/vertexBall.glsl'
import fragmentShaderBall from './shaders/ball/fragmentBall.glsl'

import vertexShaderFloor from './shaders/floor/vertexFloor.glsl'
import fragmentShaderFloor from './shaders/floor/fragmentFloor.glsl'

const sharedParameters ={
  time: 0,
  mouse: {
    x: 0,
    y: 0
  }
}


const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff )


/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('./textures/texture.png')


//Three Ball

// Material
const ballMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShaderBall,
  fragmentShader: fragmentShaderBall,
  transparent: true,
  depthWrite: false,
  clipShadows: true,
  side: THREE.DoubleSide,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(10, 5)
    },
    uTime: {
      value: sharedParameters.time
    },
    uColor: {
      value: new THREE.Color('pink')
    },
    uTexture: {
      value: null
    },
    uMouse: {
      value: {x: sharedParameters.mouse.x, y: sharedParameters.mouse.y}
    },
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uPosition: {
      value: {
        x: 0
      }
    },
    uRotation: {
      value: {

      }
    }
  }
})


//Cannon Ball




//Three floor

const floorMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShaderFloor,
  fragmentShader: fragmentShaderFloor,
  transparent: true,
  depthWrite: false,
  clipShadows: true,
  side: THREE.DoubleSide,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(10, 5)
    },
    uTime: {
      value: sharedParameters.time
    },
    uColor: {
      value: new THREE.Color('green')
    },
    uTexture: {
      value: null
    },
    uMouse: {
      value: {x: sharedParameters.mouse.x, y: sharedParameters.mouse.y}
    },
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uPosition: {
      value: {
        x: 0
      }
    },
    uRotation: {
      value: {

      }
    }
  }
})


//Cannon Floor
