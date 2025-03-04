const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    let promise = new Promise((resolve, reject) => {resolve(books)});
    promise.then(
        (allBooks) => res.send(JSON.stringify(allBooks, null, 4))
    );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let promise = new Promise((resolve, reject) => {resolve(books)});
    promise.then(
        (allBooks) => res.send(allBooks[req.params.isbn])
    );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let promise = new Promise((resolve, reject) => {resolve(books)});
    promise.then((allBooks) => {
        const bookValues = Object.values(allBooks);
        let authorBooks = [];
        for (let index = 0; index < bookValues.length; index++) {
            if (bookValues[index].author == req.params.author) {
                authorBooks.push(bookValues[index])
            }
        };
        return res.send(authorBooks);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let promise = new Promise((resolve, reject) => {resolve(books)});
    promise.then((allBooks) => {
        const bookValues = Object.values(allBooks);
        let titleBooks = [];
        for (let index = 0; index < bookValues.length; index++) {
            if (bookValues[index].title == req.params.title)
            titleBooks.push(bookValues[index])
        }
        return res.send(titleBooks);
    });
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
