const express = require("express")
const cors = require("cors")
const Anthropic = require("@anthropic-ai/sdk")

const app = express()

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

app.use(cors())
app.use(express.json())

const sessions = {}

app.post("/chat", async (req, res) => {
  const { message } = req.body
  const userId = req.headers["x-forwarded-for"] || req.ip

  if (!message) {
    return res.status(400).json({ error: "Mensagem não enviada." })
  }

  if (!sessions[userId]) {
    sessions[userId] = {
      nome: null,
      telefone: null
    }
  }

  const session = sessions[userId]

  try {

    const response = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 300,
      system: "Você é uma recepcionista de clínica que coleta nome e telefone para agendamento.",
      messages: [
        {
          role: "user",
          content: `Mensagem: ${message}
Nome: ${session.nome || "não informado"}
Telefone: ${session.telefone || "não informado"}`
        }
      ]
    })

    let reply = response.content[0].text

    if (!session.nome) {
      session.nome = message
      reply += "\n\nQual seu telefone com DDD?"
    } else if (!session.telefone) {
      session.telefone = message
      reply += "\n\nPerfeito, vamos te chamar no WhatsApp 😊"
    }

    res.json({ reply })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT)
})
