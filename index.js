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

app.get("/authors", async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName ASC`;
  let rows = await executeSQL(sql);
  res.render("displayAuthors", {"authors": rows});
});

app.get("/quotes", async (req, res) => {
  let sql = `SELECT authorId, quote, firstName, lastName FROM q_authors NATURAL JOIN q_quotes ORDER BY quote ASC`;
  let rows = await executeSQL(sql);
  res.render("displayQuotes", {"quotes": rows});
});

app.get("/quote/addNew", async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName ASC`;
  let sql2 = `SELECT DISTINCT category FROM q_quotes ORDER BY category ASC`;
  let rows = await executeSQL(sql);
  let rows2 = await executeSQL(sql2);
  res.render("newQuotes", {"authors": rows, "categories": rows2});
});

app.post("/quote/new", async (req, res) => {
  let q = req.body.quote;
  let c = req.body.category;
  let l = req.body.likes;
  let id = req.body.authorId;

  let sql = `INSERT INTO q_quotes (quote, authorId, category, likes) VALUES ( ?, ?, ?, ?)`;
  let params = [q, id, c, l];
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
      host: "ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "wgmp9bmqkgbq2vgh",
      password: "a9iv66p43fsrtz7g",
      database: "f5b3hurtj9m99eoe",
      port: "3306"
   }); 
   return pool;

} //dbConnection

//start server
app.listen(process.env.PORT || 5000, () => {
console.log("Expresss server running...")
} )

