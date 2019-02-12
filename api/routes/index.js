const express = require('express');
const { posts } = require('../controllers');
const router = express.Router();

router.get('/posts', posts.get);
router.post('/posts', posts.post);
//router.put('/posts', posts.put);
//router.delete('/posts', posts.delete);

module.exports = router;
