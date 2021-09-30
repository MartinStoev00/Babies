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

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

io.on("connection", socket => {
    socket.on("data", speed => {
        let s = speed.speed;
        let date = new Date();
        let day = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
        let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        io.sockets.emit("data", {speed:s, time: time});

        const newBaby = new BabyModel({speed: s, time: time, day: day});
        newBaby.save();
    });
});

appExpress.get("/babies", async (req, res) => {
    try {
        const allBabies = await BabyModel.find()
        const days = new Set(allBabies.map(baby => baby["day"]))
        const ret = Array.from(days).map(day => {
            return {
                babies: allBabies.filter(currBaby => currBaby["day"] === day),
                day: day
            }
        })
        res.status(201).json(ret)
    } catch (err) {
        console.log(err)
        res.status(500).json({...err})
    }
})

http.listen(3000 , () => console.log('Server Running'))