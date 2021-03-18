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