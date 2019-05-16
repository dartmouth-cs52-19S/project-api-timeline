import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const EventSchema = new Schema({
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

// create PostModel class from schema
const EventModel = mongoose.model('Post', EventSchema);

export default EventModel;
