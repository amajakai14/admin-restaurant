import { Client, ConnectionConfig } from "pg";
import * as statement from "./sqldata";

executeSql();
async function executeSql() {
  const connection = await connect();
  await query(statement.removeTable, connection);
  await query(statement.removeCorp, connection);
  await query(statement.addCorp, connection);
  await query(statement.addTable, connection);
  end(connection);
  console.log("migration done");
}
const credentials = {
  user: "lineserverdb",
  host: "localhost",
  database: "linemenudb",
  password: "lineserverpw",
  port: 5432,
};

async function connect() {
  const config: ConnectionConfig = {
    connectionString:
      "postgresql://lineserverdb:lineserverpw@localhost:5432/linemenudb?schema=public",
  };
  const client = new Client(config);
  await client.connect();
  return client;
}

async function query(statement: string, connection: Client) {
  const result = await connection.query(statement);
  console.log(result);
}

function end(connection: Client) {
  connection.end();
}
