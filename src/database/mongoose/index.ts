import mongoose from 'mongoose'

export async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI!)

  console.log('MongoDB connected')
}