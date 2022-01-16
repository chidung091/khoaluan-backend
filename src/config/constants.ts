import msg from './message.json'

export const MSG = msg

export enum EOrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}
