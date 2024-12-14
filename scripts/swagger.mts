import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const schemaPath = process.env.SCHEMA_PATH || 'schema/1_0_5.yml';
console.log(`Loading schema: ${schemaPath}`);

const projectRoot = join(__dirname, '..');
const swaggerDocument = YAML.load(join(projectRoot, schemaPath));

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}/swagger`;

app.listen(PORT, async () => {
  console.log(`Swagger UI is running on ${url}`);
  await open(url);
});
