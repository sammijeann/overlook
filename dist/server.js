import { connectToDb } from './connection.js';
import DataQueries from './actions.js';
async function runQueries() {
    await connectToDb();
    const dataQueries = new DataQueries();
    dataQueries.startActions();
}
runQueries();
