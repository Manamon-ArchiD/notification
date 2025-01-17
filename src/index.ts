import express from 'express';
import { connect } from 'ts-postgres';

const PORT = 3000;

(async () => {
  const client = await connect({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  });

  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello, TypeScript with HMR d!'); 
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  await client.end();
})();