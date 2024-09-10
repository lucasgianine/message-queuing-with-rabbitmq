// Anterior: receive.js
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const queue = 'task_queue'

    // Isso dá certeza que a que foi declarada antes de ser consumida
    channel.assertQueue(queue, {
      durable: true
    })

    channel.prefetch(1)

    channel.consume(queue, (message) => {
      const seconds = message.content.toString().split('.').length - 1

      console.log(` [x] Received: ${message.content.toString()}`)

      setTimeout(() => {
        console.log(' [x] Done')
        channel.ack(message)
      }, seconds * 1000)
    }, {
      noAck: false
    })
  })
})
