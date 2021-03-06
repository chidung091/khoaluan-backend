import * as dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const getEnv = (key: string): string => {
  return process.env[key]
}
export const ENV = process.env.NODE_ENV
export const PORT = process.env.PORT
// JWT
// MySQL
export const MYSQL_HOST = process.env.MYSQL_HOST
export const MYSQL_PORT = process.env.MYSQL_PORT
export const MYSQL_ROOT_USER = process.env.MYSQL_ROOT_USER
export const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME

export const EMAIL_NAME = process.env.EMAIL_NAME
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

export const RATING_SERVICE = getEnv('RATING_SERVICE')
export const API_KEY = getEnv('API_KEY')
export const MICROSERVICE_HOST = getEnv('MICROSERVICE_HOST')
export const BE2_SERVICE = getEnv('BE2_SERVICES')
export const BE_AUTH_SERVICE = getEnv('BE_AUTH_SERVICES')

export const SERVER_URL = getEnv('SERVER_URL')
