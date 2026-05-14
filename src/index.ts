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
      name: 'Tudo Delicioso',
      email: 'admin@tudodelicioso.br',
      passwordHash: await PasswordAdapter.hashPassword('admin123'),
      role: 'ADMIN',
    })

    await user.save()
  }
}

main()