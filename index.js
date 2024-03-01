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

// This function accepts id as its argument and finds the object
// in the array the value of which at the "_id" key if equal to id
function findObjectById(array, id) {
  for (let i = 0; i < array.length; i++) {
      if (array[i]._id == id) {
          return array[i];
      }
  }
  // Return null if no object with the specified _id is found
  return null;
}

function findObjectByUsername(array, username) {
  for (let i = 0; i < array.length; i++) {
      if (array[i].username == username) {
          return array[i];
      }
  }
  // Return null if no object with the specified _id is found
  return null;
}

// Initiate the "users" array
let users = [];

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  // Check if user already exists
  let matchingObject = findObjectByUsername(users, username);
  if(matchingObject) {
    res.json(matchingObject);
  }
  else {
  // Generate userID
  let randomInteger;
  do {
    randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
  } while(findObjectById(users, randomInteger));

  userID = randomInteger;

  // Create new user object
  const newUser = {username: username, _id: userID.toString()}

  // Push new user to the array
  users.push(newUser);

  // Respond with the new user
  res.json(newUser);}
})

app.get("/api/users", (req, res) => {
  res.json(users);
})

app.post("/api/users/:_id/exercises", (req, res) => {

  // Retrieve description and duration informations from form
  const description = req.body.description;
  console.log(description);
  const duration = parseFloat(req.body.duration);
  console.log(duration);

  let toUsedate
  
  if(!req.body.date) {
    // If no date submitted create new date object with present date
    // as value.
    toUsedate = new Date();
  }
  else {
    // This code converts the submitted date to a valid ISO format
    // and then the format required by the test (Ex : "Mon Jan 01 1990")
    let toUsedateString = req.body.date;
    const notIsoDate = new Date(toUsedateString);
    toUsedate = new Date(notIsoDate.toISOString());
    console.log(toUsedateString);
  }
  console.log(toUsedate);

  // Retrieve the id from the submitted form
  const idtofind = req.params._id;
  console.log(idtofind);

  // Find the object corresponding to the above id in the "users" array
  const userObject = findObjectById(users, idtofind);
  console.log(userObject);

  // Build the response object
  const exercise = {
    username: userObject.username, 
    description: description, 
    duration: duration,
    date: toUsedate.toDateString(),
    _id: userObject._id
  };
  console.log(exercise);

  

  // Send response
  res.json(exercise);
})

app.get("/api/users/:_id/logs", (req, res) => {
  const idtofind = req.params._id;
  const userObject = findObjectById(users, idtofind);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
