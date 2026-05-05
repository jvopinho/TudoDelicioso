import path from 'node:path'

import express from 'express'

import { env } from '@/env'

export const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(import.meta.dirname, '../views'))
app.use(express.json())

app.get('/', (req, res) => {
  res.render('main', { title: 'Tudo Delicioso' })
})

export function startServer() {
  app.listen(env.PORT, env.HOST, () => {
    console.log(`🚀 Server is running at http://${env.HOST}:${env.PORT}`)
  })
}