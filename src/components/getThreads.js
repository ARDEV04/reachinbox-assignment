const axios = require('axios');

// Replace this token with the one you received
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibW9udXJhbmphbjI1MUBnbWFpbC5jb20iLCJpZCI6MTU3OSwiZmlyc3ROYW1lIjoiQmlub2QiLCJsYXN0TmFtZSI6IkJoYWkifSwiaWF0IjoxNzQ2OTgwNTkyLCJleHAiOjE3Nzg1MTY1OTJ9.DrALXAi4YICQv0USd6W0S8f4yCleWM2z5pLSM1MaE-0';

// Axios config to make a GET request
const config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://hiring.reachinbox.xyz/api/v1/onebox/list', // API URL to get email threads
  headers: {
    Authorization: `Bearer ${token}`, // Bearer token for authentication
  },
};

// Axios request to fetch data
axios.request(config)
  .then((response) => {
    console.log("✅ Threads fetched successfully:");
    console.log(JSON.stringify(response.data, null, 2)); // Pretty print the response
  })
  .catch((error) => {
    console.error("❌ Error fetching threads:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  });
