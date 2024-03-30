import { SetMetadata } from '@nestjs/common';

export const metadataKey = 'roles';
export const Roles = (...roles: number[]) => SetMetadata(metadataKey, roles);
