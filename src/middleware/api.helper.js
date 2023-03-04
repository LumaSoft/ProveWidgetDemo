const axios = require('axios');
const { API_BASE_URL, DEFAULT_REQUEST_HEADERS } = require('../config/db');
const apiHelper = require('../middleware/api.helper');

console.log(axios.isCancel('something'));


async function apiRequest(access_token, method, path, data) {
    
    try {
      const response = await callApi(access_token, method, path, data);
      console.log(response);
      return response
      
    } catch (error) {

        if (error.response.status == 401 || error.response.status == 403) {
            // if we expire session between user navigating to the page and the API call
            //show the error on the client
        }

        console.error(error);
    }

}
//callRequestAsync(apiUrl: String = Constants.apiServer, httpMethod: HTTPMethod = HTTPMethod.get, requestBody: Data?) async throws -> Data {
async function callApi(access_token, method, path, data) {
    
    try{
        

        const url = `${API_BASE_URL}/${path}`;        
        let headers = { ...DEFAULT_REQUEST_HEADERS }; 
        if (access_token != "") headers.Authorization = `Bearer ${access_token}`;
       
        let config = {
            method,
            url,
            data,
            headers,
        };
        const { data: result } = await axios(config);
        return result;


    } catch (error) {
    
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
       
          throw error
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
    };
}


async function refreshToken(access_token, refresh_token) {
    
    try {
      const response = await callApi(access_token, "post", "v1/session/verify");      
      return { "accessToken": access_token, "refreshToken": refresh_token }
      
      
      
    } catch (error) {

        try{
            if (error.response.status == 401 || error.response.status == 403) {
                // refresh the token and call the original api request
                const url = `${API_BASE_URL}/v1/session/refresh`;            
                let headers = { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                    'x-authorization': `Bearer ${refresh_token}` 
                };             
                
                let config = {
                    method: "post",
                    url,
                    data: {},
                    headers
                };
                const newTokens = await axios(config);
    
                     
                if (newTokens.status == 200 ) {
                    return { accessToken: newTokens.data.access_token, refreshToken: refresh_token }
                  }
            }
    
            console.error(error);
        }catch (error) { 


        }
        
    }

}

module.exports = {
    apiRequest, refreshToken
}