# 📓 Blog

<p align="center">
  <img src="https://media.giphy.com/media/CiTLZWskt7Fu/source.gif"><br />
  Maybe is not the best work, but it's honest work
</p>



### Install
```js
npm install
```
### Launch server
```js
npm start
```
### Types
##### User
    - _id (User's ID)
    - token (Token to generate at login)
    - mail (User Mail to register)
    - password (Password to register)
    - author (Detect if the user is an author (author = true) or a reader (author = false))
##### Post
    - _id (Post's ID)
    - title (Title's Post)
    - description (Post description)
    - author (Post Author)
##### Query
    - getPost (Introducing an specific post by ID, it show the content of specified post)
    - getPosts (Show all posts)
    - getUserPosts (Introducing an specific author by ID, it show his posts)
##### Mutation
    - login (Login)
    - logout (Logout)
    - addUser (Add a new author or reader)
    - addPost (Just authors can add posts)
    - removeUser (Remove a reader or an author with his posts)
    - removePost (Remove an author's post)
##### Subscription
    - userSubscription (Subscribe to an author. You will be notified when the author add a new post)