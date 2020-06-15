import './styles'

const container = document.getElementById('container')

const iframes = []

document.addEventListener('DOMContentLoaded', init)

function init () {
  const iframeControl = makeIframe({ src: 'http://localhost:3001' })
  const iframe3D = makeIframe({ src: 'http://localhost:3002' })
  container.appendChild(iframeControl)
  container.appendChild(iframe3D)

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
    // case: 
  }

}

function makeIframe ({
  src,
  name,
  width = 700,
  height = 400,
  className = 'page-iframe'
}) {
  const iframe = document.createElement('iframe')
  iframe.classList.add(className)
  iframe.setAttribute('src', src)
  iframe.setAttribute('width', width)
  iframe.setAttribute('height', height)
  return iframe
}
