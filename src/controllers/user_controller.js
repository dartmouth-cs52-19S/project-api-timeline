import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user_model';
import TimelineModel from '../models/timeline_model';

dotenv.config({ silent: true });


export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user), timeline: req.user.timeline });
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
        const newTimeline = new TimelineModel();
        newTimeline.title = `${user.username}'s Timeline!`;

        // admin check
        if (username === 'admin' || username === 'shep' || username === 'regina'
        || username === 'zoe' || username === 'abhi' || username === 'katie'
        || username === 'tim') {
          user.admin = true;
        } else {
          user.admin = false;
        }

        // save the timeline
        newTimeline.save();
        user.timeline = newTimeline._id;
        user.save()
          .then((rslt) => {
            console.log('got result', rslt);
            res.send({ token: tokenForUser(rslt), timeline: rslt.timeline });
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

// checks if user with given username exists
export const checkUsername = (req, res) => {
  const { username } = req.body;
  let check = false;
  User.findOne(username)
    .then((response) => {
      check = true;
    })
    .catch((err) => {
      console.log(err);
    });
  res.json(check)
    .catch((err) => {
      console.log('Error');
      res.status(500).json({ err });
    });
};


// what does this function do? just returns the user but with
// the information you sent it?
// Returns all user information
export const getUserInfo = (req, res) => {
  const {
    username, email, startTime, timelines, timeline, admin,
  } = req.user;
  const user = new User({
    username, password: null, email, startTime, timelines, timeline, admin,
  });
  console.log('Goddamit');
  res.json(user);
};

export const updateUserInfo = (req, res) => {
  console.log(req.body);
  // const {
  //   email, username, password,
  // } = req.body;

  // const fields = {
  //   email,
  //   username,
  //   password,
  // };

  const { id } = req.user;

  if (req.body.password) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;
    } catch (error) {
      console.log(error);
    }
  }

  User.findByIdAndUpdate(id, req.body)
    .then((result) => {
      console.log('Success Updating');
      console.log('fegsfgsfgwgf');

      res.json(result);
    })
    .catch((error) => {
      console.log('Failed updating');
      console.log(error);
      res.status(500).json({ error });
    });
};


// export const getUserInfo = (req, res) => {
//  console.log(req.user);

//   User.findOne(req.user.email)
//     .then((use) => {
//       console.log('Goddamit');
//       console.log(use);
//

//       res.json(use);
//     })
//     .catch((error) => {
//       console.log('Why are you like this');

//       res.status(505).json(error);
//     });
// };

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
