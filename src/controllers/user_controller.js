import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';
import TimelineModel from '../models/timeline_model';

dotenv.config({ silent: true });


export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

// eslint-disable-next-line consistent-return
export const signup = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  const { username } = req.body;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide email and password');
  }


  User.findOne({ email })
    .then((result) => {
      console.log(result);

      if (result != null) {
        res.json('ERROR USER EXISTS');
      } else {
        const { startTime } = req.body;
        const user = new User();
        user.password = password;
        user.email = email;
        user.username = username;
        user.startTime = startTime;
        user.timeline = new TimelineModel();
        user.save()
          .then((rslt) => {
            console.log('got result');
            res.send({ token: tokenForUser(user) });
          })
          .catch((err) => {
            console.log('Error');
            res.status(500).json({ err });
          });
      }
    })
    .catch((error) => {
      console.log('Error up');

      res.status(500).json({ error });
    });
};

// this isn't really getting anything?
// since the front end has the user to send can't it access the user info?
// or atleast just store it after signing in?
// Gets and returns username
export const getUser = (req, res) => {
  const { username } = req.user;
  res.json(username)
    .catch((err) => {
      console.log('Error');
      res.status(500).json({ err });
    });
};


// what does this function do? just returns the user but with
// the information you sent it?
// Returns all user info
// export const getUserInfo = (req, res) => {
//   const { username } = req.user;
//   const { email } = req.user;
//   const { password } = req.user;
//   const { currentPlace } = req.user;
//   const { startTime } = req.user;
//   const { timelines } = req.user;
//   const { timeline } = req.user;
//   const user = new User({
//     username, password, email, currentPlace, startTime, timelines, timeline,
//   });
//   res.json(user)
//     .catch((err) => {
//       console.log('Error');
//       res.status(500).json({ err });
//     });
// };
export const getUserInfo = (req, res) => {
  User.findOne(req.user.email)
    .then((use) => {
      res.json(use);
    })
    .catch((error) => {
      res.status(505).json(error);
    });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}


// add to the users timeline
// gets id for the timeline to add and add it to the users timeline
