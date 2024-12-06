const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../schema/1_0_5.yml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Swagger UI is running on http://localhost:${PORT}/api-docs`);
});
// TODO ブラウザを起動したい
