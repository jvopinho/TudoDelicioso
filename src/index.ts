import 'dotenv/config'

import { startServer } from '@/http/app'

import { PasswordAdapter } from './adapters/password-adapter'
import { connectMongo } from './database/mongoose'
import { User } from './database/sequelize/user'

async function main() {
  connectMongo()
  startServer()

  const adminUserAlreadyExists = await User.findOne({ 
    where: { id: 1 }, 
  })

  if(!adminUserAlreadyExists) {
    const user = new User({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@email.com',
      passwordHash: await PasswordAdapter.hashPassword('123456'),
      role: 'ADMIN',
    })

    await user.save()
  }
}

main()