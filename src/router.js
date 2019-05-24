import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import * as Timelines from './controllers/timeline_controller';
import { requireAuth, requireSignin } from './services/passport';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// /your routes will go here
router.route('/posts')
  .post(requireAuth, Posts.createPost)
  .get(Posts.getPosts);

router.route('/posts/:postID')
  .put(requireAuth, Posts.updatePost)
  .get(Posts.getPost)
  .delete(requireAuth, Posts.deletePost);

// timeline routes
router.route('/explore')
  .get(Timelines.rootTimeline);

router.route('/timeline')
  .post(Timelines.createTimeline);

router.route('/timeline/:timelineID')
  .post(Timelines.updateTimeline)
  .delete(Timelines.deleteTimeline)
  .get(Timelines.getTimeline);

// linking route to save to user
router.route('/user/link')
  .post(Timelines.linkTimelines);

router.route('/auth')
  .get(requireAuth, UserController.getUser);

router.route('/personal')
  .get(requireAuth, UserController.getUserInfo)
  .post(requireAuth, Timelines.userAddTimeline);

// router.route('/addparents')
//   .get(() => { Timelines.fillParentsHelper('5ce1b7c6c75aa400347686ee', null); });

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

export default router;
