const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')
const User = new Schema({
    username: String,
    password: String,
    salt : String,
    admin: { type: Boolean, default: false }
})

// create new User document
User.statics.create = function(username, password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
    .update(password)
    .digest('base64')

        const user = new this({
            username,
            password : encrypted
        })
        // return the Promise
        return user.save()
}

// find one user by using username
User.statics.findOneByUsername = function(username) {
    return this.findOne({
        username
    }).exec()
}


// verify the password of the User documment
User.methods.verify = (password)=> {
    const encrypted = crypto.createHmac('sha1', config.secret)
    .update(password)
    .digest('base64')
    console.log(this.password,encrypted);
    return this.password === encrypted
}
// verify the password of the User documment
User.methods.verify = (password,pass)=> {
    const encrypted = crypto.createHmac('sha1', config.secret)
    .update(password)
    .digest('base64')
    console.log('pass > ',pass,encrypted,this);
    return pass === encrypted
}

User.methods.assignAdmin = function() {
    this.admin = true
    return this.save()
}

module.exports = mongoose.model('User', User)