const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
      },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin','customer'],
        required: true,
        default: 'user'
    },
    signedUp: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: Object,
        url: String,
        id: String,
    },
    books: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Book'
    }]
})

userSchema.pre('save', async function( next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User =  mongoose.model('User', userSchema);

module.exports = User;