import * as THREE from 'three'
import CameraControls from 'camera-controls'
CameraControls.install({ THREE })

import {
  EVT_IFRAME_READY,
  EVT_IFRAME_FRAME_RENDERED,
  EVT_IFRAME_MOUSEPRESSED,
  EVT_IFRAME_MOUSEMOVED,
} from '../../shared/constants'

import {
  getIframeName,
} from '../../shared/helpers'

import './styles'

const iframeName = getIframeName(window.location.search)
const dpr = devicePixelRatio || 1
const renderer = new THREE.WebGLRenderer({ alpha: true })
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.01, 1000)
const cameraControls = new CameraControls(camera, document.body)

let oldMouseX = 0
let oldMouseY = 0

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

  scene.add(new THREE.GridHelper(20, 20))

  window.addEventListener('message', onMessage)

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
      const { mouseX, mouseY, width, height } = data.payload
      const dx = (mouseX - oldMouseX) * 0.5
      const dy = (mouseY - oldMouseY) * 0.5
      const azimuthAngle = dx * (Math.PI / 180)
      const polarAngle = dy * (Math.PI / 180)
      cameraControls.rotate(azimuthAngle, polarAngle, true)
      oldMouseX = mouseX
      oldMouseY = mouseY
      break
    }
  }

}

