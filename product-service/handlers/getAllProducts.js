import { Client } from 'pg';

import { dbConfig } from '../dbConfig';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const getAllProducts = async (event) => {
  console.log('Lambda getAllProducts invocation with event: ', event);
  const client = new Client(dbConfig);
  await client.connect();
  try {
    const query = 'select * from products p left join stocks s on p.id = s.product_id';
    const products = await client.query(query);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(products.rows)
    };
  } catch(e) {
    console.log('Lambda getAllProducts error: ', e.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({'err': e.message})
    }
  }
  finally {
    client.end();
  }
};
