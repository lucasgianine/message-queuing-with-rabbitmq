const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const exchange = 'logs'

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })

    channel.assertQueue('', {
      exclusive: true
    }, (err, q) => {
      if (err) throw err

      console.log(` [x] Received: ${message.content.toString()}`)
      channel.bindQueue(q.queue, exchange, '')

      channel.consume(q.queue, (message) => {
        if (message.content) console.log(` [x] ${message.content.toString()}`)
      }, { noAck: true })
    })
  })
})
