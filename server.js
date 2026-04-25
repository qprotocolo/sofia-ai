const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Sofia online 🚀')
})

app.post('/chat', (req, res) => {
  const { message } = req.body

  res.json({
    reply: 'Sofia respondeu: ' + message
  })
})

app.listen(process.env.PORT || 3000)
