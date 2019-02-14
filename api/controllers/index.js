const { getPosts, postPosts, postPhotos } = require('../services');

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
      res.send(await postPosts(req.body.map(update=>{
        delete update.tempId;
        return update;
      })));
    }
    catch(error) {
      console.log(error.message);
      res.sendStatus(500) && next(error);
    }
  }
}

const photos = {
  post: async(req, res, next) => {
    try{
      res.send(await postPhotos(req, res));
    }
    catch(error) {
      console.log(error.message);
      res.sendStatus(500) && next(error);
    }
  }
}

module.exports = {
  posts,
  photos
}
