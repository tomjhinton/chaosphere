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
  },
  u_resolution: {
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

const ballGeometry = new THREE.SphereGeometry(1,1,32)


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


const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
scene.add(ballMesh)
//Cannon Ball




//Three floor
const floorGeometry = new THREE.BoxGeometry(5,5,0.5)

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

const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)

scene.add(floorMesh)
//Cannon Floor





/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{

  //Update uniforms
  if (sharedParameters.u_resolution !== undefined){
    sharedParameters.u_resolution.x = window.innerWidth
    sharedParameters.u_resolution.y = window.innerHeight
  }
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.localClippingEnabled = true
renderer.globalClippingEnabled = true

/**
 * Animate
 */



const clock = new THREE.Clock()

const tick = () =>{
  const elapsedTime = clock.getElapsedTime()
  // console.log(camera)
  //Update Material
  sharedParameters.time = elapsedTime



  // mesh.rotation.z +=0.001
  // Update controls
  controls.update()
  // mesh.position.copy(camera.position)


  // Render
  renderer.render(scene, camera)



  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
