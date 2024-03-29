import Timeline from '../models/timeline_model';
// import User from '../models/user_model';

export const createTimeline = (req, res) => {
  const timeline = new Timeline();
  timeline.title = req.body.title;
  timeline.time = req.body.time;
  timeline.cover_url = req.body.cover_url;
  timeline.level = req.body.level;
  timeline.filter = req.body.filter;
  timeline.content = req.body.content;
  timeline.parent = req.body.parent;
  timeline.events = [];

  // save and return the result if successful
  timeline.save()
    .then((result) => {
      // add to its parent's events
      Timeline.findById(timeline.parent)
        .then((par) => {
          par.events.push(result._id);
          par.save();
        });

      // send the result back as confirmation
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// needed?
export const updateTimeline = (req, res) => {
  console.log(req.body);

  const fields = {
    title: req.body.title,
    time: req.body.time,
    cover_url: req.body.cover_url,
    level: req.body.level,
    filter: req.body.filter,
    content: req.body.content,
    parent: req.body.parentID,
  };
  console.log(req);

  Timeline.findByIdAndUpdate(req.params.timelineID, fields, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// delete a timeline object and all its associated children
export const deleteTimeline = (req, res) => {
  // remove from parent
  Timeline.findById(req.params.timelineID)
    .then((toDelete) => {
      Timeline.findByIdAndUpdate(toDelete.parent)
        .then((parent) => {
          // https://www.hostingadvice.com/how-to/javascript-remove-element-array/
          parent.events.splice(parent.events.indexOf(toDelete._id), 1);
        });
    });
  deleteHelper(req.params.timelineID);
  res.json('Deleted.');
};


// delete helper recursive
function deleteHelper(timelineID) {
  Timeline.findByIdAndRemove(timelineID)
    .then((deleted) => {
      // says to use an iterator it seems like for...of should
      // use an iterator itself...
      // eslint-disable-next-line no-restricted-syntax
      for (const childID of deleted.events) {
        deleteHelper(childID);
      }
    })
    .catch((error) => {
      console.log('big error in delete helper...', error);
    });
}

// just to relink everything to make sure they have a parent value
export function fillParentsHelper(timelineID, parentID) {
  Timeline.findById(timelineID)
    .then((found) => {
      console.log('found: ', found.title);
      if (found.parent == null) {
        console.log('found a null parent...', found.title);
        found.parent = parentID;
        found.save();
      }
      // says to use an iterator it seems like for...of should
      // use an iterator itself...
      // eslint-disable-next-line no-restricted-syntax
      for (const childID of found.events) {
        fillParentsHelper(childID, found._id);
      }
    })
    .catch((error) => {
      console.log('big error in delete helper...', error);
      console.log(timelineID, parentID);
    });
}

// respond with the highest level of the timeline
// based on the root timeline
export const rootTimeline = (req, res) => {
  // find the root timeline
  Timeline.findOne({ title: 'root' })
    .populate('events', ['title', 'time', 'content', 'cover_url'])
    .then((result) => {
      console.log(result);
      res.json(result);
      // res.send('timelines should be returned');
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// get a specific timeline by id (req.params.timelineID)
export const getTimeline = (req, res) => {
  // res.send('single timeline looked up');
  Timeline.findById(req.params.timelineID)
    .populate('events', ['title', 'time', 'content', 'cover_url'])
    .then((result) => {
      // console.log(result);
      res.json(result);
      // res.send('timelines should be returned');
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

// return the user's timeline
export const getUserTimeline = (req, res) => {
  // res.send('single timeline looked up');
  Timeline.findById(req.user.timeline)
    .populate('events', ['title', 'time', 'content', 'cover_url'])
    .then((result) => {
      // console.log(result);
      res.json(result);
      // res.send('timelines should be returned');
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

export const linkTimelines = (req, res) => {
  helperLinkTimelines(req.body.parentID, req.body.childID)
    .then((ret) => {
      console.log(ret);
      if (ret === 'Linked.') {
        res.send(ret);
      } else if (ret === 'Already linked.') {
        res.send(ret);
      } else {
        res.status(501).json(ret);
      }
    })
    .catch((ret) => {
      console.log('in catch: ', ret);
      res.status(502).json(ret);
    });
};

function helperLinkTimelines(parentID, childID) {
  return new Promise((resolve, reject) => {
    console.log(parentID);
    Timeline.findById(parentID)
      .then((par) => {
        if (par.events.indexOf(childID) < 0) {
          par.events.push(childID);
          console.log(par);
          par.save();
          // par.update();
          resolve('Linked.');
        } else {
          resolve('Already linked.');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const userAddTimeline = (req, res) => {
  console.log('CHILD ID: ', req.body.childID);
  helperLinkTimelines(req.user.timeline, req.body.childID)
    .then((resp) => { res.send(resp); })
    .catch((error) => { console.log(error.message); res.status(508).json(error); });
  // User.findOne({ email: req.user.email })
  //   .then((user) => {
  //     if (user.timeline.events.indexOf(req.body.childID) < 0) {
  //       user.timeline.events.push(req.body.childID); // have to save timeline?
  //       // user.save(); // don't think this has to save
  //       res.json('Linked to user.');
  //     } else {
  //       res.json('Already linked to user.');
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ error });
  //   });
};

// helper for unsaving timeline from user's timeline
function helperRemoveEvent(parentID, childID) {
  return new Promise((resolve, reject) => {
    console.log(parentID);
    Timeline.findById(parentID)
      .then((par) => {
        if (par.events.indexOf(childID) > -1) {
          par.events.splice(par.events.indexOf(childID), 1);
          console.log(par);
          par.save();
          // par.update();
          resolve('Removed from users saved timelines');
        } else {
          resolve('Does not exist in users timelines');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function unsaveTimeline(req, res) {
  // call helper function with user id and whatnot
  helperRemoveEvent(req.user.timeline, req.body.childID)
    .then((resp) => { res.send(resp); })
    .catch((error) => { console.log(error.message); res.status(508).json(error); });
}
