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
  const geo = `https://ipwho.is/${IP}`;

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


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  
  const requestTimeISS = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(requestTimeISS, (error, response, body) => {

    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const parsedRequestISS = JSON.parse(body);
    // console.log(parsedRequestISS.response);

    // Rename and assign response object to flyOverTimes
    const { response: flyOverTimes } = parsedRequestISS;

    callback(null, flyOverTimes);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, IP) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(IP, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, flyOverTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, flyOverTimes);
      });
    });
  });
};






module.exports = {
  nextISSTimesForMyLocation
};