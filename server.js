const path = require('path')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/index.html`))
})

app.get('/iframe-3d', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/iframe-3d/index.html`))
})

app.get('/iframe-control', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/iframe-control/index.html`))
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))