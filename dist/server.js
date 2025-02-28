import { connectToDb } from './connection.js';
import DataQueries from './actions.js';
import dotenv from 'dotenv';
dotenv.config();
async function runQueries() {
    //await setEnvVariables();
    await connectToDb();
    const dataQueries = new DataQueries();
    dataQueries.startActions();
}
runQueries();
