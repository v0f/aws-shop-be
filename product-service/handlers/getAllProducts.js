'use strict';

import productList from '../productList.json';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const getAllProducts = async (event) => {
  console.log('Lambda invocation with event: ', event);
  try {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(productList)
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({'err': e.message})
    }
  }
};
