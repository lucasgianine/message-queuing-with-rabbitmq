const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => { // A configuração é a mesma que o send.js
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    // Declarando a queue no consumer
    const queue = 'hello'

    channel.assertQueue(queue, {
      durable: false
    })

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`)

    channel.consume(queue, (message) => { // Funciona de forma assíncrona, espera a mensage e só exibe assim que o RabbitMQ enviar para o consumer
      console.log(` [x] Received: ${message.content.toString()}`)
    }, {
      noAck: true
    })
  })
})
