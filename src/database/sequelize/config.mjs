export default {
  dialect: 'postgres',
  host: process.env.POSTGRES_ENDPOINT.split(':')[0],
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: console.log,
  define: {
    timestamps: true,
  },
}