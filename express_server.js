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

// database object
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

//users object
const users = {
  'userRandomID': {
    id: "userRandomID",
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  'user2RandomID': {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};


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

app.get("/urls/new", (req, res) => {
  res.render('urls_new');
})

//post handler for new url form
app.post("/urls", (req, res) => {
  //console.log(req.body);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
  if (!urlDatabase[req.params.shortURL]) {
    res.render('invalid_short');
    return;
  }
  res.render('urls_show', templateVars);
});


//post handler for editing longurl
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.updateURL
  res.redirect(`/urls/${req.params.shortURL}`);
})

//post handler for delete
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})


//will forward to LongURL based on short URL, if short url exists in urlDatabase
app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.render('invalid_short');
    return;
  }
  res.redirect(urlDatabase[req.params.shortURL]);
})
app.get('*', (req, res) => {
  res.render('invalid_short');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});