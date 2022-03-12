import { RouteInfo } from '@nestjs/common/interfaces'
import { RequestMethod } from '@nestjs/common'

export const APPLICATION_JSON = 'application/json'

export const enum AUTH_HEADERS {
  ACCESS_TOKEN = 'authorization',
  USER_IDENTIFIER = 'sub',
  NAMESPACE = 'namespace',
  ENTERPRISE = 'enterprise',
}

export const enum API_URLS {
  AUTHORIZATION_URL = '/token',
  GET_HEADER_MAPPING = '/header/mapping-template',
}

export const DEFAULT_TIMEZONE = 'Asia/Kuala_Lumpur'

export const TOTAL_COUNT_HEADER_NAME = 'x-total-count'
export const NEXT_PAGE_HEADER_NAME = 'x-next-page'
export const PAGE_HEADER_NAME = 'x-page'
export const PAGES_COUNT_HEADER_NAME = 'x-pages-count'
export const PER_PAGE_HEADER_NAME = 'x-per-page'

export const ACCESS_TOKEN_HEADER_NAME = 'authorization'

export const CORS_EXPOSED_HEADERS =
  `${NEXT_PAGE_HEADER_NAME},${PAGE_HEADER_NAME},${PAGES_COUNT_HEADER_NAME},` +
  `${PER_PAGE_HEADER_NAME},${TOTAL_COUNT_HEADER_NAME}`

export const EXCLUDED_USER_MIDDLEWARE_ROUTES: RouteInfo[] = [
  {
    path: '/health/services/status',
    method: RequestMethod.GET,
  },
]

export const EXCLUDED_LOGGER_MIDDLEWARE_ROUTES: RouteInfo[] = [
  {
    path: '/health/services/status',
    method: RequestMethod.GET,
  },
]

export enum UserDataJwtProperties {
  USERID = 'userId',
  SUB = 'sub',
  USER_TYPE = 'cognito:groups',
  MERCHANT_USER_ID = 'merchantUserId',
}

export enum HttpContextProperties {
  USER_ID = 'userId',
  USER = 'user',
  ACCESS_TOKEN = 'accessToken',
}

export enum UserRole {
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

export const MAX_FILTER_FROM_CURRENT_DATE = 6

export const POSTAL_CODE_REGEX = /^\d{5}$/

export const PHONE_NUMBER_REGEX = /^(\+65|\+60|\+66)\d{8,10}$/

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/
