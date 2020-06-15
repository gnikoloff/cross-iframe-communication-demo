import {
  EVT_IFRAME_READY,
  EVT_IFRAME_CONTROL_MOUSEMOVE,
  EVT_IFRAME_MOUSEMOVED,
  EVT_IFRAME_CONTROL_MOUSEDOWN,
  EVT_IFRAME_MOUSEPRESSED,
} from '../../shared/constants'

import {
  getIframeName,
  sendMessageToParent,
} from '../../shared/helpers'

import './styles'

const ALLOWED_COLORS = ['#1abc9c', '#16a085', '#f39c12', '#f1c40f', '#c0392b', '#3498db', '#8e44ad']
const iframeName = getIframeName(window.location.search)

const dpr = devicePixelRatio || 1

let canvas
let ctx
let lastMouseX
let lastMouseY
let isMouseDown = false
let currColorIdx = 0

document.addEventListener('DOMContentLoaded', init)

function init () {
  sendMessageToParent({
    type: EVT_IFRAME_READY,
    iframeName,
  })

  canvas = document.createElement('canvas')
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  canvas.style.width = `${innerWidth}px`
  canvas.style.height = `${innerHeight}px`
  document.body.appendChild(canvas)

  ctx = canvas.getContext('2d')

  document.body.addEventListener('mousedown', onMouseDown)
  document.body.addEventListener('mousemove', onMouseMove)
  document.body.addEventListener('mouseup', onMouseUp)
  document.body.addEventListener('mouseleave', onMouseUp)

  window.addEventListener('message', onWindowMessage)

}

function onWindowMessage (e) {
  let data
  try {
    data = JSON.parse(e.data)
  } catch (e) {
    return
  }
  switch (data.type) {
    case EVT_IFRAME_MOUSEPRESSED: {
      const { mouseX, mouseY } = data.payload
      isMouseDown = true
      lastMouseX = mouseX
      lastMouseY = mouseY
      ++currColorIdx
      currColorIdx %= ALLOWED_COLORS.length
      break
    }
    case EVT_IFRAME_MOUSEMOVED: {
      const { mouseX, mouseY } = data.payload
      ctx.beginPath()
      ctx.strokeStyle = ALLOWED_COLORS[currColorIdx]
      ctx.moveTo(lastMouseX, lastMouseY)
      ctx.lineTo(mouseX, mouseY)
      ctx.stroke()
      lastMouseX = mouseX
      lastMouseY = mouseY
      break
    }
  }
}

function onMouseDown (e) {
  sendMessageToParent({
    type: EVT_IFRAME_CONTROL_MOUSEDOWN,
    payload: {
      mouseX: e.pageX,
      mouseY: e.pageY,
      width: innerWidth,
      height: innerHeight,
    }
  })
}

function onMouseMove (e) {
  if (isMouseDown) {
    sendMessageToParent({
      type: EVT_IFRAME_CONTROL_MOUSEMOVE,
      payload: {
        mouseX: e.pageX,
        mouseY: e.pageY,
        width: innerWidth,
        height: innerHeight,
      }
    })
  }
}

function onMouseUp () {
  isMouseDown = false
}