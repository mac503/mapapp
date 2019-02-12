const { db } = require('../db');

const getPosts = async () => {
  try{
    return await db.getPosts();
  }
  catch(e) {
    throw new Error(e.message);
  }
}

module.exports = {
  getPosts
}
