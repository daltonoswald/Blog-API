const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const opts = { toJSON: { virtuals: true } };

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, minLength: 1, maxLength: 200 },
    author: { type: Schema.Types.ObjectId, ref: "User", require: true },
    text: { type: String, required: true, minLength: 1, maxLength: 2000 },
    date: { type: Date, required: true, default: Date.now },
    published: { type: Boolean, required: true, default: true },
}, opts);

PostSchema.virtual('url').get(function () {
    return `/posts/${this._id}`;
});

PostSchema.virtual('date_formatted').get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

PostSchema.virtual('date_time_formatted').get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.TIME_SIMPLE);
})

PostSchema.virtual('date_and_time_formatted').get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});


module.exports = mongoose.model('Post', PostSchema);