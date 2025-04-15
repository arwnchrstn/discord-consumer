import * as amqplib from 'amqplib'
import DbService from './DbService'

class DiscordQueueConsumer {
  private static instance: DiscordQueueConsumer
  private connection: amqplib.Connection | undefined
  private channel: amqplib.Channel | undefined

  private constructor() { }

  public static getInstance(): DiscordQueueConsumer {
    if (!DiscordQueueConsumer.instance) {
      this.instance = new DiscordQueueConsumer()
      return this.instance
    }
    return this.instance
  }

  public async init(): Promise<void> {
    try {
      this.connection = await amqplib.connect(process.env.queue_url as string)
      this.channel = await this.connection.createChannel()

      await this.channel.assertQueue(process.env.queue_name as string, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": process.env.dead_letter_ex as string,
          "x-dead-letter-routing-key": process.env.dead_queue_routing_key as string,
          "x-message-ttl": 1000 * 60 * 60 * 24 * 7
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  public async consume(dbService: DbService): Promise<void> {
    try {
      await this.channel?.prefetch(1)

      this.channel?.consume(process.env.queue_name as string, async (message) => {
        if (message !== null) {
          try {
            const messageContent = message.content.toString()

            dbService.sendToDatabase(messageContent)
              .then(async () => {
                console.log(`Message consumed: ${new Date().toISOString()}`)
                console.log(`Message: ${messageContent}`)

                // await new Promise(resolve => setTimeout(resolve, 2000));

                this.channel?.ack(message)
              })
              .catch(async (error: any) => {
                console.log(error.message)
                if(error.message.includes('Invalid queue data')) {
                  this.channel?.sendToQueue(process.env.dead_queue as string, Buffer.from(messageContent), { persistent: true })
                  // await new Promise(resolve => setTimeout(resolve, 2000));
                  this.channel?.ack(message)
                  return
                }
                else {
                  // await new Promise(resolve => setTimeout(resolve, 2000));
                  this.channel?.nack(message, false, true)
                }
              })
          } catch (error: any) {
            console.log(error.message)
            // await new Promise(resolve => setTimeout(resolve, 2000));
            this.channel?.nack(message, false, true)
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export default DiscordQueueConsumer