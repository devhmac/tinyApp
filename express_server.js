const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}
//handles root
app.get("/", (req, res) => {
  res.send('<html><body><h1>Hello World!</h1></body></html>\n');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase)
})




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});