const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => { // Criando conexão no servidor
  if (err) throw err

  conn.createChannel((err, channel) => { // Cria canal para desenvolver a maior parte da API
    if (err) throw err

    // Declarando queue/fila
    const queue = 'hello'
    const message = 'Hello World!'

    channel.assertQueue(queue, {
      durable: false
    })

    channel.sendToQueue(queue, Buffer.from(message)) // O conteúdo é um array de bytes
    console.log(` [x] Sent: ${message}`)
  })

  setTimeout(() => {
    conn.close()
    process.exit(0)
  }, 500) // Fecha conexão
})
