import {
  EVT_IFRAME_READY,
  EVT_IFRAME_CONTROL_MOUSEMOVE,
  EVT_IFRAME_MOUSEMOVED,
  EVT_IFRAME_CONTROL_MOUSEDOWN,
  EVT_IFRAME_MOUSEPRESSED,
  EVT_IFRAME_FRAME_RENDERED,
} from '../../shared/constants'

import {
  getIframeName,
  sendMessageToParent,
} from '../../shared/helpers'

import './styles'

const iframeName = getIframeName(window.location.search)

const dpr = devicePixelRatio || 1

let canvas
let cursorPosition
let ctx
let isMouseDown = false
let mouseX = 0
let mouseY = 0

document.addEventListener('DOMContentLoaded', init)

function init () {
  sendMessageToParent({
    type: EVT_IFRAME_READY,
    iframeName,
  })

  cursorPosition = document.createElement('div')
  cursorPosition.style.position = 'fixed'
  cursorPosition.style.zIndex = '1'
  cursorPosition.style.right = cursorPosition.style.bottom = '24px'
  cursorPosition.style.transition = 'opacity 0.2s ease-in'
  cursorPosition.style.opacity = '0'
  document.body.appendChild(cursorPosition)

  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  onResize()

  ctx = canvas.getContext('2d')

  renderIndicator({ x: canvas.width / 2, y: canvas.height / 2 })

  document.body.addEventListener('mousedown', e => onMouseDown({ x: e.pageX, y: e.pageY }))
  document.body.addEventListener('mousemove', e => onMouseMove({ x: e.pageX, y: e.pageY }))
  document.body.addEventListener('mouseup', onMouseUp)
  document.body.addEventListener('mouseleave', onMouseUp)

  document.body.addEventListener('touchstart', e => {
    onMouseDown({ x: e.touches[0].clientX * dpr, y: e.touches[0].clientY * dpr })
  })
  document.body.addEventListener('touchmove', e => {
    e.preventDefault()
    e.stopPropagation()
    onMouseMove({ x: e.touches[0].clientX * dpr, y: e.touches[0].clientY * dpr })
  })
  document.body.addEventListener('touchend', onMouseUp)
  document.body.addEventListener('touchcancel', onMouseUp)

  window.addEventListener('message', onWindowMessage)
  window.addEventListener('resize', onResize)

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
      cursorPosition.style.opacity = '1'
      break
    }
    case EVT_IFRAME_MOUSEMOVED: {
      mouseX = data.payload.mouseX
      mouseY = data.payload.mouseY
      break
    }
    case EVT_IFRAME_FRAME_RENDERED: {
      const { dt } = data.payload
      if (!isMouseDown) {
        return
      }
      renderIndicator({ x: mouseX, y: mouseY })
      cursorPosition.textContent = `X: ${mouseX} Y: ${mouseY}`
      break
    }
  }
}

function onMouseDown ({ x, y }) {
  sendMessageToParent({
    type: EVT_IFRAME_CONTROL_MOUSEDOWN,
    payload: {
      mouseX: x,
      mouseY: y,
      width: innerWidth,
      height: innerHeight,
    }
  })
}

function onMouseMove ({ x, y }) {
  sendMessageToParent({
    type: EVT_IFRAME_CONTROL_MOUSEMOVE,
    payload: {
      isMouseDown,
      mouseX: x,
      mouseY: y,
      width: innerWidth,
      height: innerHeight,
    }
  })
}

function onMouseUp () {
  isMouseDown = false
}

function renderIndicator ({ x, y }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(x, y)
  ctx.lineTo(canvas.width, canvas.height)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(canvas.width, 0)
  ctx.lineTo(x, y)
  ctx.lineTo(0, canvas.height)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, y, 10 * dpr, 0, Math.PI * 2)
  ctx.fill()
}

function onResize () {
  canvas.width = innerWidth * dpr
  canvas.height = innerHeight * dpr
  canvas.style.width = `${innerWidth}px`
  canvas.style.height = `${innerHeight}px`
}
