const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'Usera'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'Usera'
    },
    content: {
        type: String
    }

}, { timestamps: true })


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }
