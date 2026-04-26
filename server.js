const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// memória simples (simula sessão)
let etapa = {}

app.post('/chat', (req, res) => {
  const { message } = req.body
  const user = "user1" // depois podemos melhorar isso

  if (!etapa[user]) etapa[user] = "inicio"

  switch (etapa[user]) {

    case "inicio":
      etapa[user] = "intencao"
      return res.json({
        reply: "Olá! 👋 Sou a Sofia, assistente da clínica. Você deseja marcar uma consulta ou tirar dúvidas?"
      })

    case "intencao":
      if (message.toLowerCase().includes("consulta") || message.toLowerCase().includes("marcar")) {
        etapa[user] = "especialidade"
        return res.json({
          reply: "Perfeito! 😊 Qual especialidade você precisa? (clínico geral, odontologia, psicologia)"
        })
      } else {
        return res.json({
          reply: "Entendi 😊 Pode me explicar melhor como posso te ajudar?"
        })
      }

    case "especialidade":
      etapa[user] = "data"
      return res.json({
        reply: "Ótimo! 🗓️ Qual dia e horário você prefere?"
      })

    case "data":
      etapa[user] = "dados"
      return res.json({
        reply: "Para finalizar, me informe seu nome completo e telefone 📞"
      })

    case "dados":
      etapa[user] = "fim"
      return res.json({
        reply: "Perfeito! ✅ Seu pedido foi registrado. Em breve entraremos em contato para confirmar."
      })

    default:
      return res.json({
        reply: "Posso te ajudar com mais alguma coisa? 😊"
      })
  }
})

app.get('/', (req, res) => {
  res.send("Sofia AI rodando 🚀")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT))
