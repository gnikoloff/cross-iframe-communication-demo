export const getIframeName = (src) => {
  const queryParams = new URLSearchParams(src)
  return queryParams.get('name')
}

export const sendMessageToParent = data => {
  if (parent) {
    let message
    try {
      message = JSON.stringify(data)
    } catch (e) {
      // ...
    }
    parent.postMessage(message, '*')
  }
}