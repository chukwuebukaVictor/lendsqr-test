const bcrypt = require('bcryptjs');

// async function hashedPass(password){
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// }

const hashedPass = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

module.exports = hashedPass;