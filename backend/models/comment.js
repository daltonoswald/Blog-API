const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", require: true },
    text: { type: String, required: true, minLength: 1, maxLength: 200 },
    post: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
    date: { type: Date, required: true, default: Date.now },
});

CommentSchema.virtual('url').get(function () {
    return `/comments/${this._id}`;
});

CommentSchema.virtual('date_formatted').get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Comment', CommentSchema);