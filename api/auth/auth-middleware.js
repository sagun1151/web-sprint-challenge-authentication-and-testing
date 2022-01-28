const bcrypt = require("bcryptjs");
const Users = require('../users/users-model')

const checkUsernameTaken = async (req, res, next) => {
    try {
        const user = await Users.findBy({ username:req.body.username })
        if(user.length){
            next({ status:401, message: 'User Already exists'})
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}

const validBody = (req, res, next) => {
    const { username, password } = req.body
    try {
        if(!username || !password){
            next({status:401, message:'Please input both fields'})
        }else {
            next()
        }
    } catch (error) {
        next(error)
    }
}

const checkUsernameExists = async (req, res, next) => {
    try {
        const user = await Users.findBy({ username: req.body.username });
        if (
          user.length &&
          bcrypt.compareSync(req.body.password, user[0].password)
        ) {
          req.user = user[0];
          next();
        } else {
          next({ status: 401, message: "Invalid credentials" });
        }
      } catch (error) {
        next(error);
      }
}

module.exports = {
    checkUsernameTaken,
    validBody,
    checkUsernameExists
}