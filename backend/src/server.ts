import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { db } from './db/database';
import { contactRoutes } from './routes/contact-routes';
import { SqliteContactRepository } from './repositories/sqlite-contact-repository';
import { ContactService } from './services/contact-service';

async function main() {
  const app = Fastify({
    logger: true,
    bodyLimit: 10 * 1024
  });

  await app.register(helmet);

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });
  
  const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

  await app.register(cors, {
    origin: allowedOrigins.length > 0
      ? allowedOrigins
      : ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Midlands Address Book API',
        description: 'REST API for managing address book contacts.',
        version: '1.0.0',
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  const repository = new SqliteContactRepository(db);
  const service = new ContactService(repository);

  await app.register(contactRoutes, {
    contactService: service,
  });

  await app.listen({
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0',
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});