const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const exchange = 'logs'
    const message = process.argv.slice(2).join(' ') ?? 'Hello World!'

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })

    /*
      A string vazia como segundo parâmetro significa que não queremos
      enviar a mensagem para nenhuma fila específica.
      Queremos apenas publicá-la em nossa troca de 'logs'.
    */
    channel.publish(exchange, '', Buffer.from(message))

    console.log(` [x] Sent: ${message}`)
  })

  setTimeout(() => {
    conn.close()
    process.exit(0)
  }, 500)
})
