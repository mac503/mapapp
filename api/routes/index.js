const express = require('express');
const { posts, photos } = require('../controllers');
const router = express.Router();

router.get('/posts', posts.get);
router.post('/posts', posts.post);
router.post('/photos', photos.post);

module.exports = router;
