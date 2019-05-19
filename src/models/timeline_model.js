import mongoose, { Schema } from 'mongoose';

// create a TimelineSchema with a title field
const TimelineSchema = new Schema({
  title: String,
  // should be either?
  // events: Array, // array of refids to other eventschemas
  events: [{ type: Schema.Types.ObjectId, ref: 'Timeline' }],
  time: Date,
  cover_url: String,
  level: Number,
  filter: String, // should just be the level above??
  content: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

// create TimelineModel class from schema
const TimelineModel = mongoose.model('Timeline', TimelineSchema);

export default TimelineModel;
