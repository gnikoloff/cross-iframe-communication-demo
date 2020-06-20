export const IFRAME_3D_SOURCE = process.env.NODE_ENV === 'development' ? 'http://192.168.0.12:3001' : 'https://iframe-3d.vercel.app'
export const IFRAME_CONTROL_SOURCE = process.env.NODE_ENV === 'development' ? 'http://192.168.0.12:3002' : 'https://iframe-control.vercel.app'
export const IFRAME_SPEED_SOURCE = process.env.NODE_ENV === 'development' ? 'http://192.168.0.12:3003' : 'https://iframe-speed.vercel.app'

export const IFRAME_3D_NAME = 'iframe-3d'
export const IFRAME_CONTROL_NAME = 'iframe-control'
export const IFRAME_SPEED_NAME = 'iframe-speed'

export const EVT_IFRAME_READY = 'iframe-to-parent-iframe-ready'
export const EVT_IFRAME_CONTROL_MOUSEDOWN = 'iframe-to-parent-iframe-control-mousedown'
export const EVT_IFRAME_CONTROL_MOUSEMOVE = 'iframe-to-parent-iframe-control-mousemove'
export const EVT_IFRAME_CONTROL_SPEED = 'iframe-to-parent-iframe-control-speed'

export const EVT_IFRAME_MOUSEPRESSED = 'parent-to-iframe-mousepressed'
export const EVT_IFRAME_MOUSEMOVED = 'parent-to-iframe-mousemoved'
export const EVT_IFRAME_FRAME_RENDERED = 'parent-to-iframe-frame-rendered'
export const EVT_IFRAME_FRAME_SPEED_CHANGED = 'parent-to-iframe-frame-speed-changed'
