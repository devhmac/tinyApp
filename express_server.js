const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

//gen random string for shortURL
const generateRandomString = () => {
  return Math.random().toString(20).substr(2, 6)
}


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
  //using route parameter for specific urls
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render('urls_new');
})

//post handler for new url form
app.post("/urls", (req, res) => {
  //console.log(req.body);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
})

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
  if (!urlDatabase[req.params.shortURL]) {
    res.render('error')
  }
  res.render('urls_show', templateVars);
});

//will forward to LongURL based on short URL, if short url exists in urlDatabase
app.get('/u/:shortURL', (req, res) => {
  // if (!urlDatabase[req.params.shortURL]) {
  //   res.render('error')
  // }
  res.redirect(urlDatabase[req.params.shortURL]);
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});