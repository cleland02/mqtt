const express = require('express')
const mysql   = require('mysql');
const myconn  = require("express-myconnection");
const { restart } = require('nodemon');
const mqtt = require('mqtt')
const routes = require('./routes');

//mqtt
const options={
    port:'1883',
    clientId:"123123",
    username:"FlespiToken JBHYSc5OysxtU0wUsIt7Lfp6FHibONhneO9WQ4yckUu5IQP0m6VY9bUDG1ElCKwE",
    password:"",
    clean:true};
const client  = mqtt.connect('mqtt://mqtt.flespi.io',options)


const app = express();

app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
app.set('port',process.env.PORT ||  9000);
//io
const http = require('http');
//create the server
const server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
const { Server } = require("socket.io");
const io = new Server(server);
// end io
const dbOptions = {
    host:'localhost',
    port:3306,
    user: 'root',
    password: '',
    database: 'mqttlogitrack',
}
const con = mysql.createConnection(dbOptions);

con.connect(function(err) {
    if (err) throw err;
})

//middlewares---
//app.use(myconn(mysql,dbOptions, 'single'));

//routes---
app.get("/",(req,res)=>{
    res.render('index')
})
/*app.use('/api/',routes) */



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
    console.log('user disconnected');
     //client.end()
    });

    socket.on('suscribe', (topic) => {
        console.log('suscribtion ok: ' + topic);
        client.subscribe(topic, function (err) {
            if (!err) {
              //client.publish('presence', 'Hello mqtt')
                console.log("conexión exitosa")
            }
        })
    });
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
        let sql = "INSERT INTO messages (message, topic  ) VALUES (?,?)";
        let values = [message.toString(),topic]
        con.query(sql,values, function (err, result) {
            if (err) throw err;
            console.log("message is saved");
            //emit the event  to receive the message
            io.emit('ioMessage',message.toString())
        });
    //client.end()
})
