import { pool, connectToDb } from './connection.js';
import DataQueries from './actions.js';

async function runQueries() {
  await connectToDb();
  // pool.query('\i', (err, res) => {
  //   if (err) {
  //     console.error('Error executing query', err);
  //   } else {
  //     console.log('Current time:', res.rows[0]);
  //   }
  // });

  const dataQueries = new DataQueries();
  dataQueries.startActions();
}

runQueries();
