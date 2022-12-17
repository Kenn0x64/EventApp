const event = require("../models/event")
const user = require("../models/user")

async function removeUserFormEvents(userid) {
    events = await event.find({ 'eventMembers': userid })
    
    for (let index = 0; index < events.length; index++) {
        eventMembers = events[index].eventMembers
        eventMembers.indexOf(userid) == -1 ? '' : eventMembers.splice(eventMembers.indexOf(userid), 1)
    }
}

async function removeEventFormUsers(eventid) {
    users = await user.find({ 'joinedEvents': eventid  })
   
    for (let index = 0; index < users.length; index++) {
        joinedevents = users[index].joinedEvents
        joinedevents.indexOf(eventid) == -1 ? '' : joinedevents.splice(joinedevents.indexOf(eventid), 1)
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