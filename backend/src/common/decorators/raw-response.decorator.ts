import { SetMetadata } from '@nestjs/common';

export const RAW_RESPONSE_KEY = 'IS_RAW_RESPONSE';
export const RawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true);
