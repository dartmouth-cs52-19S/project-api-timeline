import Timeline from '../models/timeline_model';

export const createTimeline = (req, res) => {
  const timeline = new Timeline();
  timeline.title = req.body.title;
  timeline.time = req.body.time;
  timeline.cover_url = req.body.cover_url;
  timeline.level = req.body.level;
  timeline.filter = req.body.filter;
  timeline.content = req.body.content;
  timeline.parent = req.body.parentID;

  // save and return the result if successful
  timeline.save()
    .then((result) => {
      // add to its parent's events
      Timeline.findById(req.body.parentID)
        .then((par) => {
          par.events.push(result._id);
          par.save()
            .catch((parError) => {
              res.status(500).json({ mess: 'error adding to parents events', parError });
            });
        })
        .catch((parErrorfind) => {
          res.status(500).json({
            mess: `find failed for parent id: ${req.body.parentID}`,
            parErrorfind,
          });
        });

      // send the result back as confirmation
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

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

// needed?
export const deleteTimeline = (req, res) => {
  res.send('delete a timeline here');
  Timeline.deleteOne({ _id: req.params.timelineID }, (err) => {
    if (err) return console.log(err);
    else return console.log('Deleted successfully');
  });
};

// needed?
export const updateTimeline = (req, res) => {
  console.log(req.body);
  const tgs = `${req.body.tags}`;

  const fields = {
    title: req.body.title,
    content: req.body.content,
    tags: tgs.split(' '),
    cover_url: req.body.cover_url,
  };
  console.log(req);

  Timeline.findByIdAndUpdate(req.params.timelineID, fields)
    .then((result) => {
      const updated = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        cover_url: req.body.cover_url,
      };
      res.json(updated);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
