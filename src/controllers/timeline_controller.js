import Timeline from '../models/timeline_model';

export const createTimeline = (req, res) => {
  const timeline = new Timeline();
  timeline.title = req.body.title;
  timeline.events = req.body.events;
  timeline.time = req.body.time;
  timeline.content = req.body.content;
  timeline.cover_url = req.body.cover_url;
  timeline.level = req.body.level;
  timeline.filter = req.body.filter;
  timeline.content = req.body.content;

  // save and return the result if successful
  timeline.save()
    .then((result) => {
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
