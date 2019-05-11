import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const PostSchema = new Schema({
  title: String,
  cover_url: String,
  tags: Array,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  username: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

PostSchema.index({ '$**': 'text' });

// create PostModel class from schema
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
