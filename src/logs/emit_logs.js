const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const exchange = 'direct_logs'
    const args = process.argv.slice(2)
    const message = args.slice(1).join(' ') || 'Hello World!'
    const severety = (args.length > 0) ? args[0] : 'info'

    channel.assertExchange(exchange, 'direct', {
      durable: false
    })

    channel.publish(exchange, severety, Buffer.from(message))

    console.log(` [x] Sent to ${severety}: ${message}`)
  })

  setTimeout(() => {
    conn.close()
    process.exit(0)
  }, 500)
})
