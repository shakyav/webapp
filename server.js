const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

/* const fileupload = require("./app/controllers/fileupload.controller") */

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");


/* db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');

}); */

db.sequelize.sync().then(() => {
  console.log('Drop and Resync Db');

});

require('./app/routes/auth.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to webapp" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  
});



module.exports=app


