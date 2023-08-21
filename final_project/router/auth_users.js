const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
};
const authenticatedUser = (username,password)=>{
    let existingUser = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(existingUser.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"})
    }
    if (authenticatedUser(username, password)) {
       let accessToken = jwt.sign({
           data: password
       }, "access", { expiresIn: 60*60 });

       req.session.authorization = {
           accessToken, username
       }

       return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"})
    }
})
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const currentUser = req.session.authorization['username'];
    const bookReviews = books[req.params.isbn].reviews;
    if (bookReviews) {
        const allUsernames = Object.keys(bookReviews);
        const existingReview = allUsernames.filter((username)=>{
            return (username === currentUser)
        });
        if (existingReview.length > 0) {
            bookReviews[currentUser] = req.body.review;
            return res.status(200).json({message: "Review was successfully updated."});
        } else {
            //bookReviews = {...bookReviews, bookReviews.length: {"username":currentUser,"review":req.body.review}};
            return res.status(200).json({message: "Review was successfully added."});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
