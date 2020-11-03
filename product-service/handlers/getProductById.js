'use strict';

import productList from '../productList.json';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const findProduct = async (id) => {
  return productList.find(p=>p.id == id)
}

export const getProductById = async (event) => {
  console.log('Lambda invocation with event: ', event);
  try {
    const { productId } = event.pathParameters;
    const product = await findProduct(productId);
    if(product) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(product)
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
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({'err': e.message})
    };
  }
};
