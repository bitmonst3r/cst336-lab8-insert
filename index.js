const express = require("express");
const mysql = require("mysql");
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));

//to be able to get parameters using POST method
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/author/new", async (req, res) => {
  res.render("newAuthor");
});

app.post("/author/new", async (req, res) => {
  let fName = req.body.firstName;
  let lName = req.body.lastName;
  let dateOfBirth = req.body.dob;
  let dateOfDeath = req.body.dod;
  let sex = req.body.sex;
  let profession = req.body.profession;
  let country = req.body.country;
  let portrait = req.body.portrait;
  let bio = req.body.bio;

  let sql = "INSERT INTO q_authors (firstName, lastName, dob, dod, sex, profession, country, portrait, biography) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  let params = [fName, lName, dateOfBirth, dateOfDeath, sex, profession, country, portrait, bio];
  let rows = await executeSQL(sql, params);
  res.render("newAuthor", {"message": "Author added!"});

});

app.get("/quote/new", async (req, res) => {
  res.render("newQuotes");
});

app.post("/quote/new", async (req, res) => {
  let nquote = req.body.quote;
  let qcat = req.body.category;
  let like = req.body.likes;

  let sql = "INSERT INTO q_quotes (quote, category, likes) VALUES ( ?, ?, ?)";
  
  let params = [nquote, qcat, like];
  let rows = await executeSQL(sql, params);

  res.render("newQuotes", {"message": "Quote added!"});

});

app.get("/dbTest", async (req, res) => {

let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
  return new Promise (function (resolve, reject) {
    pool.query(sql, params, function (err, rows, fields) {
    if (err) throw err;
      resolve(rows);
    });
  });
}//executeSQL

function dbConnection(){

   const pool  = mysql.createPool({
      connectionLimit: 10,
      host: "u6354r3es4optspf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "mp26jo8kppunxiix",
      password: "ik1iml4j3uexk2bp",
      database: "jkvs50o7ha454ro4"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )

