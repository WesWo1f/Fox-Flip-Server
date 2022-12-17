const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
const { Sequelize } = require('sequelize');
const {User} = require('./models');
const cors = require('cors');
const dotenv = require('dotenv');

require('dotenv').config();

const KEY = require('./config/config.js');
const bcrypt = require('bcrypt');
const saltRounds = 7;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());
const sequelize = new Sequelize(`postgres://vbvuvlwb:${process.env.dataBaseKey}@ruby.db.elephantsql.com:5432/vbvuvlwb`)

app.post('/create_new_user', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds) 
    const userAlreadyExists = await User.findOne({
      where: {
        userName: req.body.userName,
    }
    })
    if(userAlreadyExists){
      console.log("that username is already been taken")
    }else{
      try {
        await User.create({
            userID: req.body.userID, 
            userName: req.body.userName,
            password: hashedPassword,
            email: req.body.email,
            avatar: req.body.avatar,
            ranking: req.body.ranking,
            amountWon: req.body.amountWon
        })
        console.log('create new user ran!')
        } catch (error) {
        console.log("no user to be logged in...")
        console.error(error);
        }}
  }) 

app.post('/Login', async (req, res) => {
    let loggedUser = await User.findOne({
      where: {
        userName: req.body.userName,
    }
    })
    if(loggedUser != null){
      try {
        if (await bcrypt.compare(req.body.password, loggedUser.password)) {
          console.log('/Login ran and Password is Good.')
          res.json({
            serverStatus: "Server Status is good",
            serverMsg: "Login successful",
            serverCode: "GOOD"
          })
        }
        else{
          res.json({
            serverStatus: "Server Status is good",
            serverMsg: "Login Failed. User name or password incorrect",
            serverCode: "BAD"
          })
        }
      } catch (error) {
        console.log("no user to be logged in...")
        console.error(error);
      }
    }else{
      res.json({
        serverStatus: "Server Status is good",
        serverMsg: "Login Failed. No User found",
        serverCode: "BAD"
      })
    }

})
  
app.delete('/userdel/:userName',async function(req, response) {
    const UserUsers = await User.findOne({      
      where: {
        userName: req.params.userName
    }});
    if(UserUsers != null){
      console.log("delete ran!!")
      console.log(UserUsers)
        await User.destroy({
          where: {
            userName: req.params.userName
          }
        });
      response.send(`${req.params.userName}  was deleted from User list`)
    }
    else{
      console.log("delete ran!!")
      response.statusCode = 400
      response.send("user not found")
    }
    })

app.listen(3000, async () => {
    console.log('Server is running on http://localhost:3000');
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});