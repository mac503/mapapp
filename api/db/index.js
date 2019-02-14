const {knex} = require('./config.js');
const db = {};

db.getPosts = async () => {
  let rows = await knex('posts')
  .select(
    'posts.*',
    knex.raw('GROUP_CONCAT(photos.id) as photos'),
  )
  .leftJoin('photos', 'posts.id', 'photos.postId')
  .groupBy('posts.id');
  let photos = await knex('photos')
  .select('id', 'filename', 'postId');
  return {posts:rows, photos:photos};
}

db.postPosts = async (changes) => {
  //new posts
  let newIdsMap = {};
  const newPosts = await Promise.all(JSON.parse(JSON.stringify(changes)).filter(x=>x.isNew == true).map(async newPost => {
    console.log(newPost.photos);
    delete newPost.isNew;
    delete newPost.photos;
    let tempId = newPost.id;
    delete newPost.id;
    console.log('A NEW POST\n');
    console.log(newPost);
    return await knex('posts').insert(newPost).then((id)=>newIdsMap[tempId] = id[0]);
  }));
  //updates to photos
  const photos = changes.filter(x=>x.photos != undefined).map(async change =>{
    console.log('Now working on photos.');
    console.log(change.location);
    console.log(change.photos);
    console.log(change.id);
    console.log(newIdsMap);
    if(newIdsMap.hasOwnProperty(change.id)) change.id = newIdsMap[change.id];
    const deletions = await knex('photos').where({postId: change.id}).update({postId: null});
    return await Promise.all(
      change.photos.split(',').map(photoId=> knex('photos').where({id: photoId}).update({postId: change.id}))
      .concat(deletions)
    );
  });
  //all other updates
  const updates = JSON.parse(JSON.stringify(changes)).filter(x=>x.isNew == undefined).map(update => {
    delete update.photos;
    console.log('AN UPDATE\n');
    console.log(update);
    return knex('posts').where({id: update.id}).update(update);
  });

  let success = await Promise.all([].concat(newPosts, photos, updates));
  return {promiseResults:success, idsMap:newIdsMap};
}

db.postPhotos = async (filenames) => {
  const firstNewId = await knex('photos').insert(filenames);
  return await knex('photos').select('id', 'filename').where('id', '>=', firstNewId);
}

module.exports = {
  db,
}
