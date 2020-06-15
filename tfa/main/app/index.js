import './styles'

const container = document.getElementById('container')

const iframes = []

document.addEventListener('DOMContentLoaded', init)

function init () {
  const iframe3D = makeIframe({
    src: 'http://localhost:3001/index.html',
    name: 'iframe-3d',
  })
  const iframeControl = makeIframe({
    src: 'http://localhost:3002/index.html',
    name: 'iframe-control',
  })
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
  const queryParams = new URLSearchParams()
  queryParams.append('name', name)
  iframe.setAttribute('src', `${src}?${queryParams.toString()}`)
  iframe.setAttribute('width', width)
  iframe.setAttribute('height', height)
  iframe.classList.add(className)
  return iframe
}
