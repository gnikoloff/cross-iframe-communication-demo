export const getIframeName = (src) => {
  const queryParams = new URLSearchParams(src)
  return queryParams.get('name')
}