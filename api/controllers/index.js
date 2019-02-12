const { getPosts, postPosts } = require('../services');

const posts = {
  get: async (req, res, next) => {
    try{
      res.send(await getPosts());
    }
    catch(error) {
      console.log(error.message);
      res.sendStatus(500) && next(error);
    }
  },
  post: async(req, res, next) => {
    try{
      res.send(await postPosts(req.body));
    }
    catch(error) {
      console.log(error.message);
      res.sendStatus(500) && next(error);
    }
  }
}

module.exports = {
  posts
}
