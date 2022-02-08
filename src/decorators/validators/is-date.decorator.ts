import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import {
  IsDate as IsDateOriginal,
  IsNotEmpty,
  IsOptional,
  ValidationOptions,
} from 'class-validator'

export const IsDate = (
  {
    optional,
    convert,
    notEmpty,
  }: {
    optional?: boolean
    convert?: boolean
    notEmpty?: boolean
  },
  options?: ValidationOptions,
) => {
  const decorators = []
  if (optional) {
    decorators.push(IsOptional())
  }

  if (notEmpty) {
    decorators.push(IsNotEmpty())
  }

  return applyDecorators(
    ...decorators,
    Transform(({ value }) => {
      return convert ? new Date(value) : value
    }),
    IsDateOriginal(options),
  )
}
