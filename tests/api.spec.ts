import OpenAPIResponseValidator from 'openapi-response-validator';
import yaml from 'js-yaml';
import fs from 'fs';
import supertest from 'supertest';
import { Builder } from '../src/app-builder';
import TestAgent from 'supertest/lib/agent';

const openAPISpec = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8')) as any;

describe('API Tests', () => {
  let request: TestAgent;

  beforeAll(async () => {
    const builder = new Builder();
    await builder.configureDatabase(true);
    builder
      .configureExpress()
      .configureRoutes();
    request = supertest(builder.App);
  });

  it('POST /notifications - Devrait créer une notification', async () => {
    const properties = openAPISpec.paths['/notifications'].post.requestBody.content['application/json'].schema.properties;
    // exampleNotification use properties to create a valid notification
    const exampleNotification: any = {};
    Object.keys(properties).forEach((key) => {
      exampleNotification[key] = properties[key].example;
    });

    const response = await request
      .post('/notifications')
      .send(exampleNotification);

    expect(response.statusCode).toBe(201);

    // Valider la réponse
    const responseValidator = new OpenAPIResponseValidator({
      responses: openAPISpec.paths['/notifications'].post.responses,
      components: openAPISpec.components,
    });
    const validationError = responseValidator.validateResponse(response.statusCode, response.body);
    expect(validationError).toBeUndefined(); // Aucun problème de validation
  });

  it('POST /notifications - Devrait retourner une erreur 400 si le payload est invalide', async () => {
    const response = await request
      .post('/notifications')
      .send({});

    expect(response.statusCode).toBe(400);
  });

  it('GET /notifications/1 - Devrait retourner les notifications de l\'utilisateur 1', async () => {
    const response = await request
      .get('/notifications/1')
      .send();

    expect(response.statusCode).toBe(200);

    const responseValidator = new OpenAPIResponseValidator({
      responses: openAPISpec.paths['/notifications/{userId}'].get.responses,
      components: openAPISpec.components,
    });
    const validationError = responseValidator.validateResponse(response.statusCode, response.body);
    expect(validationError).toBeUndefined();
  });

  it('GET /notifications/1 - Devrait retourner une erreur 404 si l\'utilisateur n\'existe pas', async () => {
    const response = await request
      .get('/notifications/999')
      .send();

    expect(response.statusCode).toBe(404);
  });
});
