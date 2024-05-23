const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, minLength: 5 },
    password: { type: String, required: true, minLength: 8 },
    admin: { type: Boolean, required: true, default: false,}
});

UserSchema.virtual('full_name').get(function () {
    return this.first_name + ' ' + this.last_name;
})

UserSchema.virtual('url').get(function () {
    return `/users/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);