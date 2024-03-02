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

/*************************************************************************
**************************************************************************/

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

// This function accepts username as its argument and finds the object
// in the array the value of which at the "_id" key if equal to username
function findObjectByUsername(array, username) {
  for (let i = 0; i < array.length; i++) {
      console.log("array.username at " + i + " is " + array[i].username);
      if (array[i].username == username) {
          return array[i];
      }
  }
  // Return null if no object with the specified username is found
  return null;
}

// This function accepts id as its argument and finds the place
// in the array of the object the value of which at the "_id" 
// key if equal to id
function findPlaceById(array, id) {
  for (let i = 0; i < array.length; i++) {
      if (array[i]._id == id) {
          return i;
      }
  }
  // Return null if no object with the specified _id is found
  return null;
}


/**************************************************************************
****************************************************************************/

// Initiate the "users" array
let users = [];
let usersLog = [];

/************************************************************************
***********************************************************************/

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  // Check if user already exists
  let matchingObject = findObjectByUsername(users, username);

  if(matchingObject) {
    console.log("matching username is" + matchingObject.username)
    res.json(matchingObject);
  }
  else {
  // Generate userID
  let randomInteger;
  do {
    let min = 1;
    let max = 1000000;
    randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("randomInteger is" + randomInteger);
  } while(findObjectById(users, randomInteger));

  userID = randomInteger;

  // Create new user object
  const newUser = {username: username, _id: userID.toString()};
  // Create new userLog
  const newUserLog = {
    username: username, 
    count: 0, 
    _id: userID.toString(), 
    log: [],}

  // Push new user to the array
  users.push(newUser);
  // Push new user log to usersLog array
  usersLog.push(newUserLog);

  // Respond with the new user
  res.json(newUser);}
})

app.get("/api/users", (req, res) => {
  res.json(users);
})

/*********************************************************************
***********************************************************************/

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

  // Push the exercise in the corresponding user log
  const userLogObjectPlace = findPlaceById(usersLog, idtofind);
  usersLog[userLogObjectPlace].log.push(exercise);
  console.log("This user's log is" + JSON.stringify(usersLog[userLogObjectPlace].log));

  // Send response
  res.json(exercise);
})

/*************************************************************************/

app.get("/api/users/:_id/logs", (req, res) => {
  const idtofind = req.params._id;
  const userLogObject = findObjectById(usersLog, idtofind);
  const { from, to, limit } = req.query;

  
  
  for(let i = 0; i < userLogObject.count; ++i){
  console.log("The date for the "+ i + "'th element of log is " + userLogObject.log[i].date);
  }
  console.log(JSON.stringify(userLogObject));

  // Apply "from" date filter if provided
  if (from) {
    userLogObject.log = userLogObject.log.filter(element => new Date(element.date) >= new Date(from));
  }

  // Apply 'to' date filter if provided
  if (to) {
    userLogObject.log = userLogObject.log.filter(element => new Date(element.date) <= new Date(to));
  }

  // Apply 'limit' filter if provided
  if (limit) {
    userLogObject.log = userLogObject.log.slice(0, parseInt(limit, 10));
  }

  userLogObject.count = userLogObject.log.length;
  res.json(userLogObject);
})

/************************************************************************/

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
