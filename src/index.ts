import Express, { Request, Response } from 'express'
import DiscordQueueConsumer from './class/DiscordQueueConsumer'
import DbService from './class/DbService'
import axiosInstance from './lib/axios'
import 'dotenv/config'

const app = Express()

const consumer = DiscordQueueConsumer.getInstance()
consumer.init()
  .then(() => {
    const dbService = new DbService(axiosInstance);
    consumer.consume(dbService)
  })

app.listen(10001, () => {
  console.log('Consumer listening on port 10001')

  setInterval(() => {
    fetch(process.env.service_url as string)
    .then()
    .catch()
  }, 1000 * 60 * 8)
})

app.get('/health', (req: Request, res: Response) => {
  console.log('Health: ' + new Date().toISOString())
  res.send('Health')
})