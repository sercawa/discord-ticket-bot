const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    closed: {
        type: Boolean,
        default: false
    },
    closedAt: {
        type: Date,
        default: null
    },
    closedBy: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
