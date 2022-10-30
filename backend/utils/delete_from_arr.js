const event = require("../models/event")
const user = require("../models/user")

async function removeUserFormEvents(userid) {
    events = await event.find({ $or: [{ 'eventMembers': userid }, { 'invitedMembers': eventMembers }, { 'waitingForInvites': eventMembers }] })

    for (let index = 0; index < events.length; index++) {
        eventMembers = enevts[index].eventMembers
        invitedMembers = enevts[index].invitedMembers
        waitingForInvites = enevts[index].waitingForInvites

        eventMembers.indexOf(userid) == -1 ? '' : eventMembers.splice(eventMembers.indexOf(userid), 1)
        invitedMembers.indexOf(userid) == -1 ? '' : invitedMembers.splice(invitedMembers.indexOf(userid), 1)
        waitingForInvites.indexOf(userid) == -1 ? '' : waitingForInvites.splice(waitingForInvites.indexOf(userid), 1)
    }
}

async function removeEventFormUsers(eventid) {
    users = await user.find({ $or: [{ 'joinedEvents': eventid }, { 'pendingInvites': eventid }] })
    for (let index = 0; index < users.length; index++) {
        joinedevents = users[index].joinedEvents
        pendingInvites = users[index].pendingInvites

        joinedevents.indexOf(eventid) == -1 ? '' : joinedevents.splice(joinedevents.indexOf(eventid), 1)
        pendingInvites.indexOf(eventid) == -1 ? '' : pendingInvites.splice(pendingInvites.indexOf(eventid), 1)
    }
}

async function removeInviteFormUsers(inviteid) {
    users = await user.find({ 'recivedInvites': inviteid })
    for (let index = 0; index < users.length; index++) {
        recivedInvites = users[index].recivedInvites
        recivedInvites.indexOf(inviteid) == -1 ? '' : recivedInvites.splice(recivedInvites.indexOf(inviteid), 1)
    }
}

module.exports = { removeInviteFormUsers, removeEventFormUsers, removeUserFormEvents }