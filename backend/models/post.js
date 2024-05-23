const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, minLength: 1, maxLength: 25 },
    author: { type: Schema.Types.ObjectId, ref: "User", require: true },
    text: { type: String, required: true, minLength: 1, maxLength: 200 },
    date: { type: Date, required: true, default: Date.now },
    published: { type: Boolean, required: true, default: true },
});

PostSchema.virtual('url').get(function () {
    return `/posts/${this._id}`;
});

PostSchema.virtual('date_formatted').get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Post', PostSchema);