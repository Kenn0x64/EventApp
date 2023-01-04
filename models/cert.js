const mongoose = require("mongoose");
const file = require("./file");

const certificateSchema = new mongoose.Schema({
    checkInTime: {
        type: Date,
        default: new Date(0),
    },
    checkOutTime: {
        type: Date,
        default: new Date(0),
    },
    allowCert: {
        type: Boolean,
        default: false
    },
    attendedMins: {
        type: Number,
        default: 0,
        validate: {
            validator: (value) => {
                return value >= 0
            },
            message: "Invaild Attendece Time"
        }
    },
    cert: file,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizations'
    },
})

module.exports = mongoose.model("Certs", certificateSchema);