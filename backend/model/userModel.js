const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
    emailId: String,
    password: String,
    file_path: String
});

userSchema.methods.correctPassword = async function (candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword);
}
const users = mongoose.model("users", userSchema);
module.exports=users
console.log('userschema is created')