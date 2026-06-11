import { FastifyInstance } from 'fastify';
import { ContactInput } from '../repositories/contact-repository';
import { ContactService } from '../services/contact-service';

const contactResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    zipCode: { type: 'string' }
  }
} as const;

const errorResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  }
} as const;

const contactBodySchema = {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'address',
    'city',
    'state',
    'zipCode'
  ],
  additionalProperties: false,
  properties: {
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    address: { type: 'string', minLength: 1 },
    city: { type: 'string', minLength: 1 },
    state: { type: 'string', minLength: 2, maxLength: 2 },
    zipCode: { type: 'string', minLength: 5, maxLength: 10 }
  }
} as const;

export async function contactRoutes(
  fastify: FastifyInstance,
  options: { contactService: ContactService }
) {
  fastify.get('/contacts', async (_, reply) => {
    const contacts = await options.contactService.getAllContacts();
    return reply.send(contacts);
  });

  fastify.post<{ Body: ContactInput }>(
    '/contacts',
    {
      schema: {
        body: contactBodySchema
      }
    },
    async (request, reply) => {
      const contact = await options.contactService.createContact(request.body);
      return reply.code(201).send(contact);
    }
  );

  fastify.put<{ Params: { id: string }; Body: ContactInput }>(
    '/contacts/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', pattern: '^[0-9]+$' }
          }
        },
        body: contactBodySchema
      }
    },
    async (request, reply) => {
      const id = Number(request.params.id);
      const contact = await options.contactService.updateContact(id, request.body);

      if (!contact) {
        return reply.code(404).send({
          message: `Contact ${id} was not found`
        });
      }

      return reply.send(contact);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/contacts/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', pattern: '^[0-9]+$' }
          }
        }
      }
    },
    async (request, reply) => {
      const id = Number(request.params.id);
      const deleted = await options.contactService.deleteContact(id);

      if (!deleted) {
        return reply.code(404).send({
          message: `Contact ${id} was not found`
        });
      }

      return reply.code(204).send();
    }
  );
}