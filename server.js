const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.post("/chat", (req, res) => {
  const { message } = req.body

  let reply = ""

  const msg = message.toLowerCase()

  if (msg.includes("oi") || msg.includes("olá")) {
    reply = "Olá! Sou a Sofia, assistente da clínica. Como posso te ajudar?"
  } 
  else if (msg.includes("consulta")) {
    reply = "Claro! Você quer agendar uma consulta? Me diga seu nome."
  } 
  else if (msg.includes("nome")) {
    reply = "Perfeito! Agora me informe seu telefone."
  } 
  else if (msg.includes("valor")) {
    reply = "Os valores variam. Você busca consulta geral ou especialista?"
  } 
  else {
    reply = "Pode me explicar melhor?"
  }

  res.json({ reply })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT)
})
