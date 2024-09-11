const amqp = require('amqplib/callback_api')

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage: npm run topic:consumer <facility>.<severity>')
  process.exit(1)
}

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const exchange = 'topic_logs'

    channel.assertExchange(exchange, 'topic', {
      durable: false
    })

    channel.assertQueue('', {
      exclusive: true
    }, (err, q) => {
      if (err) throw err

      args.forEach((key) => {
        channel.bindQueue(q.queue, exchange, key)
      })

      channel.consume(q.queue, (message) => {
        if (message.content) console.log(` [x] ${message.fields.routingKey}: ${message.content.toString()}`)
      }, { noAck: true })
    })
  })
})
