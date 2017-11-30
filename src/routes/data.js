import {
  Router
} from 'express';
import {
  Client
} from 'pg';

const makeTable = client => new Promise((resolve, reject) => client.query('CREATE TABLE IF NOT EXISTS data_to_serve (id SERIAL, data TEXT NOT NULL, tag VARCHAR(64) NOT NULL);', (err, res) => {
  if (err) {
    reject(err);
    return;
  }
  resolve(true);
}));

const makeGet = async (req, res, next) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  try {
    client.connect();
    const {
      tag,
      id
    } = req.params || {};
    await makeTable(client);
    await new Promise((resolve, reject) => client.query(`SELECT id, data, tag FROM data_to_serve ${(tag && id) ? 'WHERE tag = $3 AND id = $4' : tag ? 'WHERE tag = $3' : ''} ORDER BY id ASC LIMIT $1 OFFSET $2;`, [req.query.n, req.query.o, ...[tag, id].filter(_=>_)], (err, sqlRes) => {
      if (err) {
        reject(err);
        return;
      }
      res.json(sqlRes.rows.map(row => req.query.tag ? { tag: row.tag, id: row.id, data: JSON.parse(row.data)} : JSON.parse(row.data)));
      resolve(true);
    }));
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
  client.end();
}

const makeDelete = async (req, res, next) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  try {
    client.connect();
    const {
      tag,
      id
    } = req.params || {};
    await makeTable(client);
    await new Promise((resolve, reject) => client.query(`DELETE FROM data_to_serve ${(tag && id) ? 'WHERE tag = $1 AND id = $2' : tag ? 'WHERE tag = $1' : ''};`, [tag, id].filter(_=>_), (err, sqlRes) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    }));
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
  client.end();
}

const makePost = async (req, res, next) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  try {
    client.connect();
    const tag = req.params && req.params.tag || 'DEFAULT';
    await makeTable(client);
    await new Promise((resolve, reject) => client.query(`INSERT INTO data_to_serve (data, tag) VALUES ${req.body.map((_, i) => `($${i+1}', $'${req.body.length + 1}) `).join(',')};`, [...req.body.map(row => JSON.stringify(row)), tag], (err, sqlRes) => {
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
}

export default (makeMutable = false) => {
  const router = Router();
  router.get('/', makeGet);
  router.get('/:tag', makeGet);
  router.get('/:tag/:id', makeGet);
  if (makeMutable) {
    router.post('/', makePost);
    router.post('/:tag', makePost);
    router.delete('/', makeDelete);
    router.delete('/:tag', makeDelete);
    router.delete('/:tag/:id', makeDelete);
  }
  return router;
}