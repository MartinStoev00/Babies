const express = require('express');
const appExpress = express();
const BabyModel = require('./BabyModel');
const http = require('http').Server(appExpress);
const io = require('socket.io')(http);
const mongoose = require("mongoose");
const mongo_uri = "mongodb+srv://root:root@cluster0.vu3n0.mongodb.net/babies?retryWrites=true&w=majority";

// app.use(express.json())
appExpress.use(express.static('public'))

const pushToMongo = (babies) => {
    babies.forEach(baby => {
        
    })
}

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

io.on("connection", socket => {
    socket.on("data", data => {
        console.log(data);
        // const baby = new BabyModel({speed: data.speed});
        // baby.save();
        io.sockets.emit("data", {
            speed: data.speed
        });
    }); 
});





http.listen(3000 , () => console.log('Server Running'))