'use strict';

// handleRequestingUser() middleware
//   -- for handling user that is requesting specific type of data

// 1. the request object should be sending the username that is requesting the data
// 2. this will result in a account lookup to check isAdmin schema property
// 3. there should be a permissions object to help map what sections should or should
//    not be returned

function decodeData(value, rounds) {
  let ran = rounds;
  let encodedValue = value;
  while (ran !== 0) {
    encodedValue = Buffer.from(encodedValue, 'base64').toString();
    ran -= 1;
  }
  return encodedValue;
}


module.exports = (request, response, next) => {
  // how many rounds to decode base64 string for final result
  const base64Rounds = 6;
  // destructure salt values for decoding
  const { START_SALT, END_SALT } = process.env;
  // decode base64 based on hash rounds provided
  const toDecode = request.headers.arbitrary;

  // decode sent string (e.g. username)
  const decodedString = decodeData(toDecode, base64Rounds);

  // strip START/END salt from string
  const deconstructedStringStart = decodedString.split(START_SALT);
  deconstructedStringStart[1].split(END_SALT);
  // result (e.g. username) will be at position 0 of split
  const deconstructedStringEnd = deconstructedStringStart[1].split('>JG34N9yedSPL.7ruk@3');
  // update request object for next handling
  request.arbitrary = deconstructedStringEnd[0];
  console.log('deconstructedString');
  console.log(request.arbitrary);
  return next();
};
