import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "postgres123",
  port: 5432
});

db.connect();

db.query("CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, title TEXT);");

const app = express();  
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items=[];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
    console.log(items);
    res.render("index.ejs", {
      listTitle: "To Do List",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  try{
    const item = req.body.newItem;
    await db.query("INSERT INTO items(title) VALUES($1)",[item]);
    res.redirect("/");
  } catch (err){
    console.log(err);    
    res.redirect("/")
  }
});

app.post("/edit", async (req, res) => {
  try{
    const item = req.body.newItem;
    await db.query("INSERT INTO items(title) VALUES($1)",[item]);
    res.redirect("/");
    let id = Number(req.body.updatedItemId);
    let updatedTitle= req.body.updatedItemTitle;
    await db.query("UPDATE items SET title=$1 WHERE id=$2",[updatedTitle,id]);
    res.redirect("/");
  } catch (err){
    console.log(err);    
    res.redirect("/")
  }
});

app.post("/delete", async (req, res) => {
  try{
    await db.query("DELETE FROM items WHERE id=$1",[req.body.deleteItemId]);
    res.redirect("/");
  } catch (err){
    console.log(err);    
    res.redirect("/")
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
