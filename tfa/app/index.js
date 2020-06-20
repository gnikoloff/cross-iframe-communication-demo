import {
  IFRAME_3D_SOURCE,
  IFRAME_CONTROL_SOURCE,
  IFRAME_SPEED_SOURCE,
  IFRAME_3D_NAME,
  IFRAME_CONTROL_NAME,
  IFRAME_SPEED_NAME,

  EVT_IFRAME_READY,
  EVT_IFRAME_CONTROL_MOUSEMOVE, 
  EVT_IFRAME_CONTROL_MOUSEDOWN,
  EVT_IFRAME_MOUSEMOVED,
  EVT_IFRAME_FRAME_RENDERED,
  EVT_IFRAME_MOUSEPRESSED,
  EVT_IFRAME_CONTROL_SPEED,
  EVT_IFRAME_FRAME_SPEED_CHANGED,
} from '../../shared/constants'

import './styles'

const container = document.getElementById('container')
const iframes = []

let rAf
let oldTime = 0

document.addEventListener('DOMContentLoaded', init)

function init () {
  const iframeControlContainer = document.getElementById('iframe-ctrl-container')
  makeIframe({
    src: IFRAME_CONTROL_SOURCE,
    name: IFRAME_CONTROL_NAME,
    parentNode: iframeControlContainer,
  })

  const iframeSpeedContainer = document.getElementById('iframe-speed-container')
  makeIframe({
    src: IFRAME_SPEED_SOURCE,
    name: IFRAME_SPEED_NAME,
    parentNode: iframeSpeedContainer,
  })
  
  const iframe3dContainer = document.getElementById('iframe-3d-container')
  makeIframe({
    src: IFRAME_3D_SOURCE,
    name: IFRAME_3D_NAME,
    parentNode: iframe3dContainer,
  })
  
  rAf = requestAnimationFrame(onRenderFrame)
  window.addEventListener('message', onWindowMessage)
  document.body.addEventListener('touchmove', e => e.preventDefault())
}

function onRenderFrame (t) {
  if (!t) t = 0
  const dt = Math.min((t - oldTime) * 0.001, 1)
  oldTime = t

  sendMessageToIframes({
    type: EVT_IFRAME_FRAME_RENDERED,
    payload: { t, dt }
  })

  rAf = requestAnimationFrame(onRenderFrame)
}

function onWindowMessage (e) {
  let data
  try {
    data = JSON.parse(e.data)
  } catch (e) {
    return
  }

  switch (data.type) {
    case EVT_IFRAME_READY: {
      const { iframeName } = data
      break
    }
    case EVT_IFRAME_CONTROL_MOUSEDOWN: {
      const { mouseX, mouseY, width, height } = data.payload
      sendMessageToIframes({
        type: EVT_IFRAME_MOUSEPRESSED,
        payload: { mouseX, mouseY, width, height }
      })
      break
    }
    case EVT_IFRAME_CONTROL_MOUSEMOVE: {
      const { isMouseDown, mouseX, mouseY, width, height } = data.payload
      sendMessageToIframes({
        type: EVT_IFRAME_MOUSEMOVED,
        payload: { isMouseDown, mouseX, mouseY, width, height }
      })
      break
    }
    case EVT_IFRAME_CONTROL_SPEED: {
      const { speed } = data.payload
      sendMessageToIframes({
        type: EVT_IFRAME_FRAME_SPEED_CHANGED,
        payload: { speed },
      })
    }
  }
}

function makeIframe ({
  src,
  name,
  parentNode,
  width = 100,
  height = 100,
  className = 'page-iframe'
}) {
  const iframe = document.createElement('iframe')
  const queryParams = new URLSearchParams()
  queryParams.append('name', name)
  iframe.setAttribute('src', `${src}?${queryParams.toString()}`)
  iframe.setAttribute('width', width)
  iframe.setAttribute('height', height)
  iframe.classList.add(className)

  iframes.push(iframe)

  const iframeControlRatioSizer = document.createElement('div')
  iframeControlRatioSizer.classList.add('ratio-sizer')
  iframeControlRatioSizer.appendChild(iframe)
  parentNode.appendChild(iframeControlRatioSizer)

  return iframe
}

function sendMessageToIframes (data) {
  iframes.forEach(iframe => iframe.contentWindow.postMessage(JSON.stringify(data), '*'))
}
