import { Router } from 'express';
import { Client } from 'pg';

export default (makePost = false) => {
  const router = Router();
  router.get('/', (req, res, next) => {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    client.connect();
    client.query('SELECT data FROM data_to_serve ORDER BY id ASC LIMIT $1 OFFSET $2;', [req.params.n, req.params.o], (err, res) => {
      if (err) {
        res.status(500).send('Server error');
        client.end();
        return;
      }
      res.json(res.rows.map(row => JSON.parse(row.data)));
      client.end();
    });
  });
  if (makePost) {
    router.post('/', (req, res, next) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      client.connect();
      client.query(`INSERT INTO data_to_serve (data) VALUES ${req.body.map((_, i) => `($${i+1}) `).join(',')};`, req.body.map(row => JSON.stringify(row)), (err, res) => {
        if (err) {
          res.status(500).send('Server error');
          client.end();
          return;
        }
        res.send(200);
        client.end();
      });
    });
  }
  return router;
}