import {
  Router
} from 'express';
import {
  Client
} from 'pg';

const makeTable = client => new Promise((resolve, reject) => client.query('CREATE TABLE IF NOT EXISTS data_to_serve (id SERIAL, data TEXT NOT NULL);', (err, res) => {
  if (err) {
    reject(err);
    return;
  }
  resolve(true);
}));

export default (makePost = false) => {
  const router = Router();
  router.get('/', async (req, res, next) => {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    try {
      client.connect();
      await makeTable(client);
      await new Promise((resolve, reject) => client.query('SELECT data FROM data_to_serve ORDER BY id ASC LIMIT $1 OFFSET $2;', [req.query.n, req.query.o], (err, sqlRes) => {
        if (err) {
          reject(err);
          return;
        }
        res.json(sqlRes.rows.map(row => JSON.parse(row.data)));
        resolve(true);
      }));
    } catch (e) {
      console.error(e);
      res.status(500).send('Server error');
    }
    client.end();
  });
  if (makePost) {
    router.post('/', async (req, res, next) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      try {
        client.connect();
        await makeTable(client);
        await new Promise((resolve, reject) => client.query(`INSERT INTO data_to_serve (data) VALUES ${req.body.map((_, i) => `($${i+1}) `).join(',')};`, req.body.map(row => JSON.stringify(row)), (err, sqlRes) => {
          if (err) {
            reject(err);
            end;
          }
          res.send(200);
          resolve(true);
        }));
      } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
      }
      client.end();
    });
  }
  return router;
}