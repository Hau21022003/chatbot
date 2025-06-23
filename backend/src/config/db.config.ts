import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const load = () => {
  const env = process.env;
  const port = env.PORT ? parseInt(env.PORT, 10) : 3000;
  const dbConfig = {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
  };
  return {
    isProduction: env.NODE_ENV === 'production',
    isDev: env.NODE_ENV === 'development',
    port,
    db: {
      ...dbConfig,
      type: 'postgres',
      synchronize: true,
      // logging: true,
      keepConnectionAlive: true,
      migrationsTableName: 'migration_typeorm',
      migrationsRun: true,
      autoLoadEntities: true,
      entities: [join(__dirname, './**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, './migrations/*{.ts,.js}')],
    } as TypeOrmModuleOptions,
  };
};

export const dbOptions = async (configService: ConfigService) =>
  configService.get<TypeOrmModuleOptions>('db');
