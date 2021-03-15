const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}
//handles root
app.get("/", (req, res) => {
  res.send('<html><body><h1>Hello Root!</h1></body></html>\n');
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});