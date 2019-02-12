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

db.updatePost = async (id, data) => {
  let success = await knex('posts')
  .where({ id: id })
  .update(data);
  return success;
}

module.exports = {
  db,
}
