import './style.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'

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

let objectsToUpdate = []
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff )

//Physics

//World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

//Materials
const defaultMaterial = new CANNON.Material('default')


const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7
  }
)

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial



/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('./textures/texture.png')


//Three Ball

const ballGeometry = new THREE.SphereGeometry(1,32,32)


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

const createSphere = (radius, position) =>{

  //Three.js mesh
  const mesh = new THREE.Mesh(ballGeometry, ballMaterial)
  mesh.castShadow = true
  mesh.position.copy(position)
  mesh.scale.set(radius, radius, radius)
  scene.add(mesh)

  //Cannon.js Body
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    positon: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial
  })
  body.position.copy(position)
  //body.addEventListener('collide', console.log('hiya'))
  world.addBody(body)

  //Save in objects to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body
  })
}

createSphere(0.5, {x: 0, y: 3, z: 0})

//Cannon Ball




//Three floor
const floorGeometry = new THREE.BoxGeometry(50,0.1,50)

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

const floorShape = new CANNON.Box(new CANNON.Vec3(50,0.1,50))
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)

world.addBody(floorBody)



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

let materialsArray = [ floorMaterial, ballMaterial]

const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>{
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime
  //Update Physics World

  world.step(1/60, deltaTime, 3)

  for(const object of objectsToUpdate){
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion)
  }
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
