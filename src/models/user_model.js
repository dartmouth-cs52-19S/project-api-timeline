import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// create a UserSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  password: { type: String },
  startTime: Date,
  timelines: Array,
  timeline: { type: Schema.Types.ObjectId, ref: 'Timeline' },
  admin: Boolean,
}, {
  toJSON: {
    virtuals: true,
  },
});

UserSchema.pre('update', function afterUserUpdate(next) {
  const user = this;
  const modified = user.getUpdate().$set.password;
  console.log('We in here');

  if (!modified) {
    return next();
  }
  try {
    console.log('We in try');

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    console.log(user);

    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});


//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    else return callback(null, isMatch);
  });
  // return callback(null, comparisonResult) for success
  // or callback(error) in the error case
};

// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
