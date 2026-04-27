const express = require("express")
const cors = require("cors")
const Anthropic = require("@anthropic-ai/sdk")

const app = express()

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

app.use(cors())
app.use(express.json())

// 🧠 Memória simples (por IP)
const sessions = {}

app.post("/chat", async (req, res) => {
  const { message } = req.body
  const userId = req.ip

  if (!message) {
    return res.status(400).json({ error: "Mensagem não enviada." })
  }

  // cria sessão se não existir
  if (!sessions[userId]) {
    sessions[userId] = {
      nome: null,
      telefone: null,
      etapa: "inicio"
    }
  }

  const session = sessions[userId]

  try {

    // 🎯 PROMPT ESTRATÉGICO (ESSA É A CHAVE DO PRODUTO)
    const systemPrompt = `
Você é Sofia, assistente virtual de uma clínica médica.

Seu objetivo NÃO é só responder.
Seu objetivo é CONVERTER o paciente em agendamento.

Fluxo obrigatório:
1. Entender intenção
2. Pedir nome (se não tiver)
3. Pedir telefone (se não tiver)
4. Confirmar interesse
5. Encaminhar para finalização

Regras:
- Seja natural, humana e simpática
- Fale como uma recepcionista real (Brasil)
- Mensagens curtas (tipo WhatsApp)
- Nunca fale que é IA
- Nunca invente horários
- Sempre conduza a conversa

Se o usuário quiser agendar:
→ peça nome e telefone

Se já tiver nome mas não telefone:
→ peça telefone

Se já tiver tudo:
→ diga que a equipe vai entrar em contato

Seja persuasiva, mas natural.
    `

    // 🧠 Atualiza estado baseado na mensagem
    if (!session.nome) {
      if (message.split(" ").length <= 3) {
        session.nome = message
      }
    } else if (!session.telefone) {
      if (message.match(/\d{8,}/)) {
        session.telefone = message
      }
    }

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `
Mensagem do usuário: ${message}

Dados atuais:
Nome: ${session.nome || "não informado"}
Telefone: ${session.telefone || "não informado"}
          `
        }
      ]
    })

    let reply = response.content[0].text

    // 🎯 Reforço de conversão automático
    if (!session.nome) {
      reply += "\n\nAh, antes de tudo, qual seu nome?"
    } else if (!session.telefone) {
      reply += "\n\nPerfeito, e qual seu telefone com DDD?"
    } else {
      reply += "\n\nPerfeito! Vou encaminhar seu atendimento agora mesmo 😊"
    }

    res.json({
      reply,
      lead: session
    })

  } catch (error) {
    console.error("Erro na API:", error.message)
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT)
})
