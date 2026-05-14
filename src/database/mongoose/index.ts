import mongoose from 'mongoose'

import { env } from '@/env'

export async function connectMongo() {
  await mongoose.connect(`mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_ENDPOINT}/?authSource=admin`)

  console.log('MongoDB connected')
}