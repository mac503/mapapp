const { getPosts } = require('../services');

const posts = {
  get: async (req, res, next) => {
    try{
      res.send(await getPosts());
    }
    catch(e) {
      console.log(e.message);
      res.sendStatus(500) && next(error);
    }
  }
}

module.exports = {
  posts
}
