import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { createGraphQLSchema } from 'openapi-to-graphql/dist/index.js';
import YAML from 'yamljs';

const app = express();

async function startServer() {
  const openAPISchema = YAML.load('./schema/1_0_6.yml');

  const { schema } = await createGraphQLSchema(openAPISchema, {
    baseUrl: process.env.NODE_URL,
  });

  app.use(
    '/graphql',
    createHandler({
      schema,
      // graphiql: true,
    }),
  );

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  });
}

startServer().catch(console.error);
