const {knex} = require('./config.js');
const db = {};

db.getPosts = async () => {
  let rows = await knex('posts')
  .select(
    'posts.*',
    knex.raw('GROUP_CONCAT(photos.filename) as photos'),
  )
  .leftJoin('photos', 'posts.id', 'photos.postId')
  .groupBy('posts.id');
  return rows;
}

db.postPosts = async (updates) => {
  let success = await Promise.all(updates.map(update => knex('posts').where({id: update.id}).update(update)));
  return success;
}

module.exports = {
  db,
}
