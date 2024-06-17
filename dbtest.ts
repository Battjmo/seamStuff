import pg from "pg";
import { readFileSync, createReadStream } from "node:fs";
import "dotenv/config";

import { from as copyFrom } from "pg-copy-streams";
import { pipeline } from "node:stream/promises";

const main = async () => {
  const { Pool } = pg;
  const sqlClient = new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: {
      ca: readFileSync("us-west-1-bundle.pem"),
      rejectUnauthorized: true,
    },
  });
  const client = await sqlClient.connect();
  try {
    // \copy public.customer (customer_id, store_id, first_name, last_name, email, address_id, activebool, create_date, last_update, active) FROM '3055.csv' WITH DELIMITER ',' CSV;
    const ingestStream = client.query(
      copyFrom(
        "COPY public.customer (customer_id, store_id, first_name, last_name, email, address_id, activebool, create_date, last_update, active) FROM STDIN DELIMITER ',' CSV;",
      ),
    );
    const sourceStream = createReadStream(
      "/Users/thelampshade/Desktop/Work/dvdrental/3055.csv",
    );
    const result = await pipeline(sourceStream, ingestStream);
    console.log(result);
  } catch (e) {
    console.log(e);
  } finally {
  }

  const result = await sqlClient.query(`SELECT * FROM public.customer`);
  console.log(result);
  client.release();
  await sqlClient.end();
};

main();
