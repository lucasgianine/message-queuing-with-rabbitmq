const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const queue = 'task_queue'
    const message = process.argv.slice(2).join(' ') ?? 'Hello World!'

    channel.assertQueue(queue, {
      durable: true
    })

    channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true
    })

    console.log(` [x] Sent: ${message}`)
  })

  setTimeout(() => {
    conn.close()
    process.exit(0)
  }, 500)
})
