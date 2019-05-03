import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.tags = req.body.tags;
  post.cover_url = req.body.cover_url;

  post.save()
    .then((result) => {
      res.json({ message: 'Post created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
export const getPosts = (req, res) => {
  Post.find({})
    .then((result) => {
      res.json(result);
      // res.send('posts should be returned');
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPost = (req, res) => {
  // res.send('single post looked up');
  Post.findById(req.params.postID)
    .then((result) => {
      console.log(result);

      res.json(result);
      // res.send('posts should be returned');
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deletePost = (req, res) => {
  res.send('delete a post here');
  Post.deleteOne({ _id: req.params.postID }, (err) => {
    if (err) return console.log(err);
    else return console.log('Deleted successfully');
  });
};

export const updatePost = (req, res) => {
  const fields = {
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    cover_url: req.body.cover_url,
  };
  console.log(req);

  Post.findByIdAndUpdate(req.params.postID, fields)
    .then((result) => {
      res.json(fields);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
