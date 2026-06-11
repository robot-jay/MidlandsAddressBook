import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { db } from './db/database';
import { contactRoutes } from './routes/contact-routes';
import { SqliteContactRepository } from './repositories/sqlite-contact-repository';
import { ContactService } from './services/contact-service';

async function main() {
  const app = Fastify({
    logger: true,
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