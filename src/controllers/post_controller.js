import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.tags = req.body.tags.split(' ');
  post.cover_url = req.body.cover_url;
  post.author = req.body.author;
  post.username = req.user.username;

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
      console.log(result);
      const nresult = [];
      result.forEach((post) => {
        let tags = '';
        post.tags.forEach((tag) => {
          if (tag !== '') {
            tags += `${tag} `;
          }
        });
        post.tags = tags;
        nresult.push(post);
      });
      console.log(nresult);

      res.json(nresult);
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
      let tags = '';
      result.tags.forEach((element) => {
        if (element !== '') {
          tags += `${element} `;
        }
      });
      result.tags = tags;
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
  if (req.body.author === req.user) {
    console.log(req.body);
    const tgs = `${req.body.tags}`;

    const fields = {
      title: req.body.title,
      content: req.body.content,
      tags: tgs.split(' '),
      cover_url: req.body.cover_url,
    };
    console.log(req);

    Post.findByIdAndUpdate(req.params.postID, fields)
      .then((result) => {
        const updated = {
          title: req.body.title,
          content: req.body.content,
          tags: req.body.tags,
          cover_url: req.body.cover_url,
        };
        res.json(updated);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  } else {
    res.json('WRONG USER, NO EDITING PERMISSION');
  }
};


export const search = (req, res) => {
  Post.find({ $text: { $search: res.body.term } })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
