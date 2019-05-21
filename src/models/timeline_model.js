import mongoose, { Schema } from 'mongoose';

// create a TimelineSchema with a title field
const TimelineSchema = new Schema({
  title: String,
  time: Date,
  cover_url: String,
  level: Number,
  filter: String, // should just be the level above??
  content: String,
  // Relationships
  // should be either?
  // events: Array, // array of refids to other eventschemas
  events: [{ type: Schema.Types.ObjectId, ref: 'Timeline' }],
  parent: { type: Schema.Types.ObjectId, ref: 'Timeline' },
}, {
  toJSON: {
    virtuals: true,
  },
});

// create TimelineModel class from schema
const TimelineModel = mongoose.model('Timeline', TimelineSchema);

export default TimelineModel;
