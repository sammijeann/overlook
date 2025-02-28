import { connectToDb } from './connection.js';
import DataQueries from './actions.js';
//import inquirer from 'inquirer';
//import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// async function setEnvVariables() {
//   const answers = await inquirer.prompt([
//     {
//       type: 'input',
//       name: 'DB_USER',
//       message: 'Enter database username:',
//     },
//     {
//       type: 'password',
//       name: 'DB_PASSWORD',
//       message: 'Enter database password:',
//       mask: '*',
//     },
//   ]);

//   // Write the provided values to the .env file
//   const envContent = `DB_NAME=${process.env.DB_NAME}\nDB_USER=${answers.DB_USER}\nDB_PASSWORD=${answers.DB_PASSWORD}\n`;
//   fs.writeFileSync('.env', envContent);
//   console.log('Environment variables set successfully.');

//   // Reload the environment variables
//   //dotenv.config();

  
// }

// // Function to clear the .env file
// function clearEnv() {
//   try {
//     const envClear = `DB_NAME=${process.env.DB_NAME}\nDB_USER=\nDB_PASSWORD=\n`;
//     fs.writeFileSync('.env', envClear);
//     console.log('.env file cleared successfully.');
//   } catch (err) {
//     console.error('Error clearing .env file:', err);
//   }
// }

// // Register event handlers to clear the .env file on exit or error
// process.on('exit', clearEnv);
// process.on('SIGINT', () => {
//   clearEnv();
//   process.exit();
// });
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught exception:', err);
//   clearEnv();
//   process.exit(1);
// });

async function runQueries() {
  //await setEnvVariables();
  await connectToDb();
  

  const dataQueries = new DataQueries();
  dataQueries.startActions();
}

runQueries();
