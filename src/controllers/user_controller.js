import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

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
        const user = new User();
        user.password = password;
        user.email = email;
        user.username = username;
        console.log(user);
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


// 🚀 TODO:
// here you should do a mongo query to find if a user already exists with this email.
// if user exists then return an error. If not, use the User model to create a new user.
// Save the new User object
// this is similar to how you created a Post
// and then return a token same as you did in in signin
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
