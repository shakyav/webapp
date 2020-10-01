const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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
/* const Role = db.role; */

db.sequelize.sync({force: true}).then(() => {
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

/* const connection = mysql.createConnection({
  host: 'localhost',
  user: 'vivek',
  password: 'Viv@2789',
  database: 'csye6225'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
connection.query('SELECT * FROM users_table', (err,rows) => {
    if(err) throw err;
  
    console.log('Data received from Db:');
    console.log(rows);
  }); */
