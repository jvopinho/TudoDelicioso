import { Options, Sequelize } from 'sequelize'

import sequelizeConfig from './config.mjs'

export const sequelize = new Sequelize(sequelizeConfig as Options)

export async function connectPostgres() {
  try {
    await sequelize.authenticate()

    console.log('PostgreSQL connected')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}