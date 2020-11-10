import { Client } from 'pg';
import { dbConfig } from '../dbConfig';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const getProductById = async (event) => {
  console.log('Lambda getProductById invocation with event: ', event);
  const { productId } = event.pathParameters;
  const client = new Client(dbConfig);
  await client.connect();
  try {
    const query = 'select * from products p inner join stocks s on p.id = s.product_id where p.id = $1';
    const product = await client.query(query,[productId]);
    if(product.rowCount > 0) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(product.rows[0])
      };
    }
    else {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({'err': "Product not found"})
      };
    }
  } catch(e) {
    console.log('Lambda getProductById error:', e.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({'err': e.message})
    };
  }
  finally {
    client.end();
  }
};
