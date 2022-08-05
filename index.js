// // index.js
// const { fetchMyIP } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });

// const { fetchCoordsByIP } = require('./iss');

// fetchCoordsByIP('8.8.8.8', (error, data) => {

//   if (error) {
//     console.log(`It didn't work!`, error);
//     return;
//   }
  
//   console.log(`It worked! Returned coordinates:`, data);
// });

// const { fetchISSFlyOverTimes } = require('./iss');

// fetchISSFlyOverTimes({latitude: '0.00000', longitude: '0.00000'}, (error, data) => {
  
//   if (error) {
//     console.log(`It didn't work!`, error);
//     return;
//   }
  
//   console.log(`It worked! Here are the fly over times:`, data);
// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});