/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');




const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  // Request IP in JSON from ipify
  const requestIP = 'https://api.ipify.org/?format=json';

  // Request function
  request(requestIP, (error, response, body) => {

    // Return error if there is an error during request
    if (error) {
      return callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // Use parse to conver JSON to object
    const ipIsObject = JSON.parse(body);
    // Get IP using dot notation
    const IP = ipIsObject.ip;

    if (!error) {
      callback(null, IP);
    }

    // console.log(IP);
  });

};


const fetchCoordsByIP = function(IP, callback) {

  // Variable to hold geo coordinates search
  const geo = `http://ipwho.is/${IP}`;

  // Request function
  request(geo, (error, response, body) => {

    if (error) {
      return callback(error, null);
    }
    
    // Parse JSON results from geo search
    const geoParsed = JSON.parse(body);

    // If invalid IP success value will be false
    if (!geoParsed.success) {
      const msg = `Success status was ${geoParsed.success}. Server message says: ${geoParsed.message} when fetching for IP ${geoParsed.ip}`;
      return callback(Error(msg), null);
    }
    
    // Store needed values of geoParsed object
    const {
      latitude,
      longitude
    } = geoParsed;
 
    // console.log(geoParsed);
    callback(null, {latitude, longitude});
  });
};


module.exports = {
  fetchCoordsByIP
};