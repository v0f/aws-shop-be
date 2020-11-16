import { Client } from 'pg';
import { dbConfig } from '../dbConfig';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const postProduct = async event => {
  console.log('Lambda postProduct invocation with:', event)
  const { title, description, price, img_url, count } = JSON.parse(event.body);
  const client = new Client(dbConfig);
  await client.connect();
  try {
    await client.query('BEGIN');

    let query = 'insert into products (title, description, price, img_url) values ($1, $2, $3, $4) returning id';
    const product = await client.query(query,[title, description, price, img_url]);

    query = 'insert into stocks (product_id, count) values ($1, $2)';
    const stock = await client.query(query, [product.rows[0].id, count]);

    await client.query('COMMIT');

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({'product_id': product.rows[0].id}),
    };
  }
  catch(e) {
      await client.query('ROLLBACK');
      console.log('Lambda postProduct error:', e.message);
      return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({'err': e.message})
      }
  }
  finally {
      client.end();
  };
}