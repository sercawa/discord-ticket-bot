const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: String,
        default: null
    },
    staffRoles: [{
        type: String
    }],
    panelChannelId: {
        type: String,
        default: null
    },
    guildIconUrl: {
        type: String,
        default: null
    },
    maxTicketsPerUser: {
        type: Number,
        default: 3
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
