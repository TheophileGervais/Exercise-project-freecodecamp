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

let users = [];

app.post("/api/users", (req, res) => {
  const username = req.body.username;
  console.log(username);

  // Generate userID
  const userID = users.length + 1;

  // Create new user object
  const newUser = {username: username, _id: userID}

  // Push new user to the array
  users.push(newUser);

  // Respond with the new user
  res.json(newUser);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
