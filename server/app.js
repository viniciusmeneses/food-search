const express = require('express')
const app = express()

app.get('/teste', (req, res) => {
  res.send({
    teste: 1
  })
})

app.listen(3000, () => {
  console.log('Back-end listening on port 3000')
})
