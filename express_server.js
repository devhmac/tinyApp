const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
//for req.cookies
app.use(cookieParser());


//gen random string for shortURL
const generateRandomString = () => {
  return Math.random().toString(20).substr(2, 6);
};
const doesKeyExistInUsers = (key, variable) => {
  for (let user in users) {
    if (users[user][key] === variable) {
      return true;
    }
  }
  return false;
};
//returns object of urls which match the cookie user_id
const urlsForUser = (id) => {
  const userUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userUrls[url] = urlDatabase[url];
    }
  }
  return userUrls;
};

// database object
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: 'defaut' },
  "9sm5xK": { longURL: "http://www.google.com", userID: 'default' }
};


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

//GET Login
app.get('/login', (req, res) => {
  const templateVars = {
    user_id: req.cookies['user_id'],
    users
  }
  res.render('login', templateVars)
})

//GET for URLS
app.get('/urls', (req, res) => {
  //templatevars.urls updated based on cookie ID
  const templateVars = {
    urls: urlsForUser(req.cookies['user_id']),
    user_id: req.cookies['user_id'],
    users
  };

  res.render('urls_index', templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies['user_id']) {
    res.redirect('/login');
    return;
  }
  const templateVars = {
    user_id: req.cookies['user_id'],
    users
  }
  res.render('urls_new', templateVars);
})

//GET URL SHOW from /urls/:shortURL
app.get('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies['user_id']) {
    if (!urlDatabase[req.params.shortURL]) {
      res.status(404);
      res.render('invalid_short');
      return;
    }
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user_id: req.cookies['user_id'],
      users
    }
    res.render('urls_show', templateVars);
    return
  }
  res.status(401)
  res.render('invalid_short')
});

//GET for registration
app.get('/register', (req, res) => {
  const templateVars = {
    user_id: req.cookies['user_id'],
    users
  }
  //if already logged in, redirect to /urls
  if (req.cookies['user_id']) {
    res.redirect('/urls');
    return;
  }
  res.render('registration', templateVars)
})

//POST for registration
app.post('/register', (req, res) => {
  if (doesKeyExistInUsers('email', req.body.email)) {
    res.status(400)
    res.send(`status code: ${res.statusCode} email already in use`);
    return;
  }
  if (req.body.email.length < 1 || req.body.password.length < 1) {
    res.status(400)
    res.send(`status code: ${res.statusCode} You must register with a valid Email and password`);
    return;
  }
  const randID = generateRandomString();
  const hashedPass = bcrypt.hashSync(req.body.password, 10);

  users[randID] = {
    id: randID,
    email: req.body.email,
    password: hashedPass
  };
  res.cookie('user_id', users[randID].id);
  //console.log(users)
  res.redirect('/urls');
});

//post handler for new url form
app.post("/urls", (req, res) => {
  if (!req.cookies['user_id']) {
    res.redirect('/login');
    return;
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL, userID: req.cookies['user_id']
  };
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);
});

//post handler for editing longurl
app.post('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies['user_id']) {
    urlDatabase[req.params.shortURL].longURL = req.body.updateURL
    res.redirect(`/urls/${req.params.shortURL}`);
    return;
  }
  res.status(401)
  res.render('invalid_short')
})

//post handler for delete
app.post('/urls/:shortURL/delete', (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies['user_id']) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
    return;
  }
  res.status(401)
  res.render('invalid_short')
});

//POST handler for /login
app.post('/login', (req, res) => {
  let loginEmail = req.body.email;
  let loginPass = req.body.password;

  //dry up this code with a function
  if (loginEmail && loginPass) {
    for (let user in users) {
      if (users[user].email === loginEmail && bcrypt.compareSync(loginPass, users[user].password)) {
        res.cookie('user_id', users[user].id);
        res.redirect('/urls');
        return;
      }
    }
  }
  res.status(403)
  res.send(`status code: ${res.statusCode} Incorrect Email or password`);
  return;
});

//POST handler for /logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

//will forward to LongURL based on short URL, if short url exists in urlDatabase
app.get('/u/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404);
    res.render('invalid_short');
    return;
  }
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.get('*', (req, res) => {
  res.render('invalid_short');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});