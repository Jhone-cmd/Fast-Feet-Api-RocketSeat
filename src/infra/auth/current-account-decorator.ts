import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { AccountPayload } from './jwt.strategy'

export const CurrentAccount = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as AccountPayload
  }
)
