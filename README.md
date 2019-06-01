# Timeline

Have you ever felt overwhelmed or undereducated about all the opportunities available to you in life? Us too. That's why we built Timeline, a website that helps you know what you don't. This is the `backend server` that helps to power all the good stuff on http://lifetime.surge.sh/. Welcome!!!

## About 
Timeline allows you to visualize big life possibilities - think college, trade school, the army, etc - and create self-curated timelines of your future, exposing you and others to options in life you wouldn't have otherwise known about.

The main goal of Timeline is exposure rather than planning - once you know about an opportunity, there are plenty of resources to figure out how to get there. Timeline aims to overcome the problem of the "unknown unknowns," and open your mind to the many possibilities in life.

## Architecture

### API Routes
* GET ```/api/explore``` returns the root timeline element which contains the list of top level timelines under an array ```events```. [link](https://timimeline.herokuapp.com/api/explore).
* GET ```/api/timeline/:timelineId``` returns the requested timeline object. [link](https://timimeline.herokuapp.com/api/timeline/5ce1dfadf41c760034ffe52d).
* POST ```/api/timeline/:timelineID``` updates the timeline. Takes the same inputes in the request as the create one.
* DELETE ```/api/timeline/:timelineID``` deletes the specific timeline as well as all of its children. USE CAUTIOUSLY. It will delete a lot if used on the wrong node. It is like rm -rf. 
* POST ```/api/timeline``` creates a new timeline object under a given parent. The post should include the req items shown on the right: 
```javascript
  timeline.title = req.body.title;
  timeline.time = req.body.time;
  timeline.cover_url = req.body.cover_url;
  timeline.level = req.body.level;
  timeline.filter = req.body.filter;
  timeline.content = req.body.content;
  timeline.parent = req.body.parentID;
```
* POST ```/api/username``` checks the user's username. 
* GET ```/api/personal``` returns the user object, including the user's timeline (does not include hashed password). This is used as the front end need the full user object at times. 
* PUT ```/api/personal``` updates the user info. 
* POST ```/api/personal``` saves a timeline to the user's timeline. Is an authorized route so it just needs the id of the timeline to be saved. Checks if the exact timeline is already saved. The user can save any timeline they would like. 
* DELETE ```/api/personal``` removes a saved timeline from the user's timeline. 
* GET ```/api/saved``` returns the user's saved timeline, it is slightly different from GET ```/api/timeline/:timelineID``` in that it returns the cover url in addition to the title, time and content. 
* POST ```/api/signin``` sign the user in. 
* POST ```/api/signup``` signs up a user, adding them to the user database. 

<details>
    <summary>Examples</summary> 

```https://timimeline.herokuapp.com/api/explore```
```json
    {
        "events": [
            {
                "_id": "5ce1dfadf41c760034ffe52d",
                "title": "Work",
                "time": "1970-01-01T10:48:00.000Z",
                "id": "5ce1dfadf41c760034ffe52d"
            },
            {
                "_id": "5ce1df40f41c760034ffe52c",
                "title": "Education",
                "time": "1970-01-01T18:00:00.000Z",
                "id": "5ce1df40f41c760034ffe52c"
            }
        ],
        "_id": "5ce1b7c6c75aa400347686ee",
        "title": "root",
        "level": 0,
        "__v": 0,
        "id": "5ce1b7c6c75aa400347686ee"
    }
```

```localhost:9090/api/timeline/5ce1c555cc465b0034eceed7```
```json
{
    "events": [
        {
            "_id": "5ce1c166cc465b0034eceecf",
            "title": "Standardized Tests",
            "time": "1970-01-01T18:00:00.000Z",
            "id": "5ce1c166cc465b0034eceecf"
        },
        {
            "_id": "5ce1c4fecc465b0034eceed0",
            "title": "Common App",
            "time": "1970-01-02T00:28:48.000Z",
            "id": "5ce1c4fecc465b0034eceed0"
        },
        {
            "_id": "5ce1c525cc465b0034eceed1",
            "title": "Letters of Recommendation",
            "time": "1970-01-02T01:55:12.000Z",
            "id": "5ce1c525cc465b0034eceed1"
        },
        {
            "_id": "5ce1c52dcc465b0034eceed2",
            "title": "FAFSA",
            "time": "1970-01-02T06:14:24.000Z",
            "id": "5ce1c52dcc465b0034eceed2"
        },
        {
            "_id": "5ce1c534cc465b0034eceed3",
            "title": "Early Decision",
            "time": "1970-01-02T04:04:48.000Z",
            "id": "5ce1c534cc465b0034eceed3"
        }
    ],
    "_id": "5ce1c555cc465b0034eceed7",
    "title": "College",
    "time": "1970-01-01T18:00:00.000Z",
    "content": "A college education can gives you ",
    "cover_url": "https://upload.wikimedia.org/wikipedia/commons/0/07/Orange_circle.png",
    "__v": 0,
    "id": "5ce1c555cc465b0034eceed7"
}
```

</details>

### Models
#### Timeline
**timeline** is the generic timeline object. It is intended to store an object that is in any level of the timeline hierarchy in the same format in case later add more levels and to simplify (hopefully) displaying these timelines. Each object contains a reference to its children ```events``` as well as information about itself. A timeline object is the following: 

```javascript
const TimelineSchema = new Schema({
  title: String,
  // array of all its children timeline objects, populated with title & time when fetched
  events: [{ type: Schema.Types.ObjectId, ref: 'Timeline' }],
  time: Date, // javascript date object (hopefully) that is just the seconds of the #months it is from start of high school
  cover_url: String, // an image url, right now these are all just orange circles
  level: Number, // this is probably unnessecary? 
  content: String,
});
```

So when you fetch either the explore page or a specific timeline you can expect a response structure of: 

```json
{
    "events": [
        {
            "_id": "5ce1c166cc465b0034eceecf",
            "title": "Standardized Tests",
            "time": "1970-01-01T18:00:00.000Z",
            "id": "5ce1c166cc465b0034eceecf"
        },
        {
            "_id": "5ce1c4fecc465b0034eceed0",
            "title": "Common App",
            "time": "1970-01-02T00:28:48.000Z",
            "id": "5ce1c4fecc465b0034eceed0"
        }
    ],
    "_id": "5ce1c555cc465b0034eceed7",
    "title": "College",
    "time": "1970-01-01T18:00:00.000Z",
    "content": "A college education can gives you ",
    "cover_url": "https://upload.wikimedia.org/wikipedia/commons/0/07/Orange_circle.png",
    "__v": 0,
    "id": "5ce1c555cc465b0034eceed7"
}
```
This was a significant design decision at the beginning of the project that certainly takes a bit to wrap your head around, but it did make traversing, adding data with varying levels under each node, removing data, saving data to the user and displaying it very easily as it was the same information that the explore page displays. It also allowed us to use some easy recursive code for deleting and some development additions that went to each node. The user's timelines are separated from the root timeline, as in they are not children under root, which makes each user's unreachable from a progression through the tree of the explore data. Of course, the user's timeline contains data from the explore timeline. Though it did take some time for us to all understand how the data model works, the additional thought did lead to a relatively simple backend in terms of the code that represents a good bit of time spent thinking about the data model and storage. 

#### Users
The user model contains the user password, email (unique), username (unique), startTime which is the time they started high school, a timeline object that is the the user's saved timelines, and a boolean for whether or not the user is an admin. Only admin users can add, delete, or update, the information presented on the explore page. 

## Setup
`yarn` all the things.

## Deployment
Deploys automatically on pull request merges using Travis and github auto-deploy to heroku. The database ends up on: 
* heroku domain: https://timimeline.herokuapp.com/

To test locally, clone `project-api-timeline` and `project-timeline` repos. `yarn dev` it all, and mongod/mongo the backend. Frontend runs on localhost port 8080 while backend runs on 9090. 


## Authors

Abhimanyu Kapur '21

Katie Goldstein '20

Regina Yan '19

Sheppard Somers '19

Zoe Yu '19

## Sources

Code is based off Abhi's Lab 5 for backend (this) and Regina's Lab 4/5 for frontend. Unfortunately we have not populated their sources to here...so check out their assignments if you're really concerned. Generally the structure follows what was given in class and in the lab assignments for lab 5. Some specific citations of code are included with the relevant lines of code. 

## Acknowledgments

TA's, especially Jasmine
Tim

![Team Photo](src/img/teamTimeline.jpeg)
