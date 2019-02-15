const { db } = require('../db');
const multer = require('multer');
const { promisify } = require('util');

const getPosts = async () => {
  try{
    return await db.getPosts();
  }
  catch(e) {
    throw new Error(e.message);
  }
}

const postPosts = async (updates) => {
  try{
    return await db.postPosts(updates.map(x=>{
      x.date = x.date.split('.')[0].replace('T', ' ');
      return x;
    }));
  }
  catch(e) {
    throw new Error(e.message);
  }
}

const postPhotos = async (req, res) => {
  try{
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, __dirname+'./../../public/photos')
      },
      filename: function (req, file, cb) {
        cb(null, Buffer.from(file.originalname + Date.now()).toString('base64')+file.originalname.match(/\.[0-9a-z]+$/i));
      }
    });

    const fileFilter = (req, file, cb) => {
      const acceptables = [
        'image/gif',
        'image/png',
        'image/jpeg',
        'image/bmp'
      ];
      if(acceptables.includes(file.mimetype)) cb(null, true)
      else cb(null, false);
    };

    const upload = promisify(
      multer({
        storage: storage,
        fileFilter: fileFilter
      }).array('photos')
    );

    return await upload(req, res).then(async (err)=>{
      if(err) throw new Error(err);
      else{
        return await db.postPhotos(req.files.map(x=> ({filename: x.filename})));
      }
    });

  }
  catch(e) {
    throw new Error(e.message);
  }
}

module.exports = {
  getPosts, postPosts, postPhotos
}
