require("./utils/database")
let express = require("express");
const { createEvent, deleteEvent, preUpdateEvent, postUpdateEvent, getEvent,getEvents } = require("./controllers/event");
const { deleteUser, preUpdateUser, postupdateUser, createUser } = require("./controllers/user");
let app = express();



const user=require("./models/user")

app.use(express.json());


app.get('/:eventId',async (req, res)  => {
    // getEvents(req,res)
    // preUpdateEvent(req,res)
    // res.send()
})

app.listen( process.env.PORT, () => {
    console.log("\u2705 Startred Server!")
})