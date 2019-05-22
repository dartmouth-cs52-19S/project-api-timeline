import Timeline from '../models/timeline_model';

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

// respond with the highest level of the timeline
// based on the root timeline
export const rootTimeline = (req, res) => {
  // find the root timeline
  Timeline.findOne({ title: 'root' })
    .populate('events', ['title', 'time'])
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
    .populate('events', ['title', 'time'])
    .then((result) => {
      console.log(result);
      res.json(result);
      // res.send('timelines should be returned');
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
