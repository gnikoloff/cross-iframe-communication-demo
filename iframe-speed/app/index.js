import './styles'

import {
  EVT_IFRAME_READY,
  EVT_IFRAME_CONTROL_SPEED,
} from '../../shared/constants'

import {
  getIframeName,
  sendMessageToParent,
} from '../../shared/helpers'

const iframeName = getIframeName(window.location.search)
const input = document.getElementsByTagName('input')[0]

let speedDisplay

document.addEventListener('DOMContentLoaded', init)

function init () {
  sendMessageToParent({
    type: EVT_IFRAME_READY,
    iframeName,
  })

  speedDisplay = document.createElement('div')
  speedDisplay.style.position = 'fixed'
  speedDisplay.style.right = speedDisplay.style.bottom = '24px'
  speedDisplay.style.zIndex = '1'
  speedDisplay.textContent = `Speed: ${input.value}`
  document.body.appendChild(speedDisplay)

  input.addEventListener('input', onInputChange)

}

function onInputChange () {
  const value = parseFloat(input.value)
  speedDisplay.textContent = `Speed: ${value}`
  sendMessageToParent({
    type: EVT_IFRAME_CONTROL_SPEED,
    payload: {
      speed: value,
    }
  })
}
