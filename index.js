const express = require('express');
const appExpress = express();
const BabyModel = require('./BabyModel');
const http = require('http').Server(appExpress);
const io = require('socket.io')(http);
const mongoose = require("mongoose");
const mongo_uri = "mongodb+srv://root:root@cluster0.vu3n0.mongodb.net/babies?retryWrites=true&w=majority";

appExpress.use(express.json())
appExpress.use(express.static('public'))

const uncommitedBabies = []

const pushToMongo = () => {
    console.log(uncommitedBabies)
    const earliest = uncommitedBabies[0]["time"]
    const latest = uncommitedBabies[uncommitedBabies.length - 1]["time"]
    const timeframe = `${earliest}=${latest}`
    uncommitedBabies.forEach(({speed, time}) => {
        const newBaby = new BabyModel({speed, time, timeframe});
        newBaby.save();
    })
    uncommitedBabies.splice(0, uncommitedBabies.length);
    console.log("End Message Sent")
}

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

io.on("connection", socket => {
    socket.on("data", speed => {
        uncommitedBabies.push({...speed, time: new Date().toString()})
        io.sockets.emit("data", {...speed, date: new Date().toString()});
    });

    socket.on("end", () => {
        pushToMongo()
    })
});

appExpress.get("/babies", async (req, res) => {
    try {
        const allBabies = await BabyModel.find()
        const timeStamps = new Set(allBabies.map(baby => baby["timeframe"]))
        const ret = Array.from(timeStamps).map(timeStamp => {
            startEnd = timeStamp.split("=")
            return {
                start: startEnd[0],
                end: startEnd[1],
                babies: allBabies.filter(currBaby => currBaby["timeframe"] === timeStamp)
            }
        })
        res.status(201).json(ret)
    } catch (err) {
        console.log(err)
        res.status(500).json({...err})
    }
})

http.listen(3000 , () => console.log('Server Running'))