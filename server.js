const express = require("express")
const cors = require("cors")
const Anthropic = require("@anthropic-ai/sdk")

const app = express()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(cors())
app.use(express.json())

app.post("/chat", async (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: "Mensagem não enviada." })
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: `Você é Sofia, recepcionista virtual de uma clínica médica.
Seu papel é:
- Cumprimentar o paciente com simpatia
- Entender o que ele precisa (consulta, dúvida, informação)
- Coletar nome completo e telefone para agendamento
- Informar que a equipe confirmará o horário em breve
- Ser empática, clara e profissional
- Responder sempre em português brasileiro

Nunca invente horários ou nomes de médicos.
Se não souber algo, peça para o paciente ligar na clínica.`,
      messages: [{ role: "user", content: message }]
    })

    res.json({ reply: response.content[0].text })

  } catch (error) {
    console.error("Erro na API:", error)
    res.status(500).json({ error: "Erro ao processar resposta." })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT))
