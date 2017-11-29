import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();
client.query('CREATE TABLE IF NOT EXISTS data_to_serve (id SERIAL, data TEXT NOT NULL);', (err, res) => {
  if (err) {
    client.end();
    throw(err);
  }
});