import * as THREE from 'three'
import CameraControls from 'camera-controls'
CameraControls.install({ THREE })

import {
  EVT_IFRAME_READY,
  EVT_IFRAME_FRAME_RENDERED,
  EVT_IFRAME_MOUSEPRESSED,
  EVT_IFRAME_MOUSEMOVED,
  EVT_IFRAME_FRAME_SPEED_CHANGED,
} from '../../shared/constants'

import {
  getIframeName,
} from '../../shared/helpers'

import particlesVertexShader from './particles-vertex-shader.vert'
import particlesFragmentShader from './particles-fragment-shader.frag'

import './styles'

const PARTICLE_COUNT = 5000
const WORLD_BOUNDARY = 50

const iframeName = getIframeName(window.location.search)
const dpr = devicePixelRatio || 1
const renderer = new THREE.WebGLRenderer({ alpha: true })
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.01, 1000)
const cameraControls = new CameraControls(camera, document.body)

let particles
let oldMouseX = 0
let oldMouseY = 0
let timeScale = 0.5
let timeScaleTarget = timeScale

document.addEventListener('DOMContentLoaded', init)

function init () {
  if (parent) {
    parent.postMessage(JSON.stringify({
      type: EVT_IFRAME_READY,
      iframeName,
    }), '*')
  }

  renderer.setPixelRatio(dpr)
  renderer.setSize(innerWidth, innerHeight)
  renderer.setClearColor(0xFFFFFF, 0)
  document.body.appendChild(renderer.domElement)

  camera.position.set(0, 5, 5)
  cameraControls.setPosition(0, 5, 5)
  cameraControls.enabled = false

  // scene.add(new THREE.GridHelper(20, 20))
  particles = generateParticles()
  scene.add(particles)

  window.addEventListener('message', onMessage)
  window.addEventListener('resize', onResize)

}

function generateParticles () {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (Math.random() * 2 - 1) * WORLD_BOUNDARY
    const y = (Math.random() * 2 - 1) * WORLD_BOUNDARY
    const z = (Math.random() * 2 - 1) * WORLD_BOUNDARY
    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    sizes[i] = i < 3 ? 20 * dpr : 2 * dpr
  }
  const bufferGeometry = new THREE.BufferGeometry()
  bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  bufferGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      timeScale: { value: 0 },
    },
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    transparent: true,
  })
  const mesh = new THREE.Points(bufferGeometry, material)
  return mesh
}

function onMessage (e) {
  let data
  try {
    data = JSON.parse(e.data)
  } catch {
    return
  }

  switch (data.type) {
    case EVT_IFRAME_FRAME_RENDERED: {
      const { t, dt } = data.payload
      const hasControlsUpdated = cameraControls.update(dt)
      particles.material.uniforms.time.value = t
      particles.material.uniforms.timeScale.value = timeScale

      timeScale += (timeScaleTarget - timeScale) * (dt * 5)
      renderer.render(scene, camera)
      break
    }
    case EVT_IFRAME_MOUSEPRESSED: {
      const { mouseX, mouseY, width, height } = data.payload
      oldMouseX = mouseX
      oldMouseY = mouseY
      break
    }
    case EVT_IFRAME_MOUSEMOVED: {
      const { isMouseDown, mouseX, mouseY, width, height } = data.payload
      if (!isMouseDown) {
        return
      }
      const dx = (mouseX - oldMouseX) * 0.5
      const dy = (mouseY - oldMouseY) * 0.5
      const azimuthAngle = dx * (Math.PI / 180)
      const polarAngle = dy * (Math.PI / 180)
      cameraControls.rotate(azimuthAngle, polarAngle, true)
      oldMouseX = mouseX
      oldMouseY = mouseY
      break
    }
    case EVT_IFRAME_FRAME_SPEED_CHANGED: {
      const { speed } = data.payload
      timeScaleTarget = speed
      break
    }
  }

}

function onResize () {
  renderer.setSize(innerWidth, innerHeight)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
}
