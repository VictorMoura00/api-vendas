import { DataSource } from 'typeorm'
import { env } from '../env'

export const dataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  schema: env.DB_SCHEMA,
  synchronize: false,
  logging: false,
  entities: ['**/entities/**/*.ts'],
  migrations: ['**/migrations/**/*.ts'],
})
