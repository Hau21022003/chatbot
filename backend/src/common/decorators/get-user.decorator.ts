import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user;

    return data ? user?.[data] : user;
  },
);
