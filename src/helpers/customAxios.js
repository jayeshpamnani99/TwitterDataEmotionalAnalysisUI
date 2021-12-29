import axios from 'axios';
import React from 'react';

let customAxios = axios.create({baseURL:"http://localhost:2500/v1/"});


//The Code Below Has Been Copied From Online .
let isAlreadyFetchingAccessToken = false;

// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = [];

function resetTokenAndReattemptRequest(error) {
  try {
    const { response: errorResponse } = error;
    const refreshToken = localStorage.getItem("refreshToken"); // Your own mechanism to get the refresh token to refresh the JWT token
    if (!refreshToken) {
      // We can't refresh, throw the error anyway
      return Promise.reject(error);
    }
    /* Proceed to the token refresh procedure
    We create a new Promise that will retry the request,
    clone all the request configuration from the failed
    request in the error object. */
    const retryOriginalRequest = new Promise(resolve => {
    /* We need to add the request retry to the queue
    since there another request that already attempt to
    refresh the token */
      addSubscriber(() => {
        resolve(axios(errorResponse.config));
      });
    });
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      axios.post('/gettoken',{refreshtoken:refreshToken},{withCredentials:true})
          .then((res)=>{
            
          })
          .catch((err)=>{
            return Promise.reject(error);
          })
          .finally(()=>{
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched();      
          })
       // save the newly refreshed token for other requests to use
      
    }
    return retryOriginalRequest;
  } catch (err) {
    return Promise.reject(err);
  }
}

function onAccessTokenFetched() {
	// When the refresh is successful, we start retrying the requests one by one and empty the queue
  subscribers.forEach(callback => callback());
  subscribers = [];
}

function addSubscriber(callback) {
    subscribers.push(callback);
}

customAxios.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    if(error.code === 401){
        // <Redirect to='/login'/>
    }else if(error.response.data.code === 401){
      return resetTokenAndReattemptRequest(error);
    }

    return Promise.reject(error);

})


export default customAxios;