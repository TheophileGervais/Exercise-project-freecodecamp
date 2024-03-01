const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

function findObjectById(array, id) {
  for (let i = 0; i < array.length; i++) {
      if (array[i]._id == id) {
          return array[i];
      }
  }
  // Return null if no object with the specified _id is found
  return null;
}

let users = [];

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  // Generate userID
  const userID = users.length + 1;

  // Create new user object
  const newUser = {username: username, _id: userID.toString()}

  // Push new user to the array
  users.push(newUser);

  // Respond with the new user
  res.json(newUser);
})

app.get("/api/users", (req, res) => {
  res.json(users);
})

app.post("/api/users/:_id/exercises", (req, res) => {
  const description = req.body.description;
  console.log(description);
  const duration = parseFloat(req.body.duration);
  console.log(duration);

  let toUsedateString;
  
  if(!req.body.date) {
    toUsedateString = new Date();
  }
  else {
    toUsedateString = req.body.date;
  }
  const notIsoDate = new Date(toUsedateString);
  const toUsedate = notIsoDate.toISOString();
  console.log(toUsedateString);
  console.log(toUsedate);

  const idtofind = req.params._id;
  console.log(idtofind);

  const userObject = findObjectById(users, idtofind);
  console.log(userObject);

  const exercise = {
    username: userObject.username, 
    description: description, 
    duration: duration,
    date: toUsedate.toDateString(),
    _id: userObject._id
  };
  console.log(exercise);

  res.json(exercise);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
