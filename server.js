const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => console.log("Mongo DB connected"))
  .catch((err) => console.log(err));

const path = require('path');           
const PORT = process.env.PORT || 5000;  

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

var api = require("./api");
api.setApp(app, mongoose);

app.use("/images", express.static(path.join(__dirname, "Images")));

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

// for Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("frontend/build"));

	app.get("*", (req, res) => {
		console.log(req.body);
		res.sendFile(
			path.resolve(__dirname, "frontend", "build", "index.html")
		);
	});
}