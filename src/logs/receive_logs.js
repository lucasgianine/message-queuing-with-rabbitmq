const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const exchange = 'direct_logs'

    channel.assertExchange(exchange, 'direct', {
      durable: false
    })

    channel.assertQueue('', {
      exclusive: true
    }, (err, q) => {
      if (err) throw err

      args.forEach((severity) => {
        channel.bindQueue(q.queue, exchange, severity)
      })

      channel.consume(q.queue, (message) => {
        if (message.content) console.log(` [x] ${message.fields.routingKey}: ${message.content.toString()}`)
      }, { noAck: true })
    })
  })
})
