import { registerAs } from '@nestjs/config';

import { EnvInterface } from './interfaces/env.interface';

export default registerAs(
  'config',
  (): EnvInterface => ({
    jwt: {
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      secret: process.env.JWT_SECRET,
    },
  }),
);
