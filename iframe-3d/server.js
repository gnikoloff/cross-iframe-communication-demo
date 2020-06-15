const path = require('path')
const express = require('express')
const app = express()
const port = 3001

app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/index.html`))
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))