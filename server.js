app.post("/chat", (req, res) => {
  const { message } = req.body

  let reply = ""

  const msg = message.toLowerCase()

  if (msg.includes("oi") || msg.includes("olá")) {
    reply = "Olá! Sou a Sofia, assistente virtual da clínica. Como posso te ajudar hoje?"
  } 
  else if (msg.includes("consulta")) {
    reply = "Claro! Você gostaria de agendar uma consulta? Me diga seu nome completo."
  } 
  else if (msg.includes("preço") || msg.includes("valor")) {
    reply = "Os valores variam conforme o atendimento. Você procura consulta geral ou especialista?"
  } 
  else if (msg.includes("nome")) {
    reply = "Perfeito! Agora me informe seu telefone para confirmar o agendamento."
  } 
  else {
    reply = "Entendi. Pode me explicar um pouco melhor para eu te ajudar?"
  }

  res.json({ reply })
})
