import path from 'node:path'

import express, { Application, NextFunction } from 'express'

import { AppRequest, AppResponse } from '@/@types/express'
import { env } from '@/env'

import { apiRoute } from './routes/api/index.route'
import { frontendRoute } from './routes/frontend/index.route'

export const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(import.meta.dirname, '../views/pages'))
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.json())

app.use(preHandler as Application)

function preHandler(req: AppRequest, res: AppResponse, next: NextFunction) {
  req.isAuthenticated = () => false
  req.getUser = () => null
  
  next()
}

app.use(frontendRoute)

app.use('/api', apiRoute)

export function startServer() {
  app.listen(env.PORT, env.HOST, () => {
    console.log(`🚀 Server is running at http://${env.HOST}:${env.PORT}`)
  })
}