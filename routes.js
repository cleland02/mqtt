const express = require('express');
const mqtt    = require('mqtt')
const routes  = express.Router();

/* const options={
    port:'1883',
    clientId:"123123",
    username:"FlespiToken JBHYSc5OysxtU0wUsIt7Lfp6FHibONhneO9WQ4yckUu5IQP0m6VY9bUDG1ElCKwE",
    password:"",
    clean:true};
const client  = mqtt.connect('mqtt://mqtt.flespi.io',options) */

routes.get('/',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err) return res.send(err)

        conn.query("SELECT * FROM messages", (err,rows)=>{
            if(err) return res.send(err)

            res.json(rows);
        })
    })
})

routes.post('/topic',(req,res)=>{
    client.subscribe('flespi/message/gw/devices/4662532', function (err) {
        if (!err) {
          //client.publish('presence', 'Hello mqtt')
            console.log("conexión exitosa")
        }
    })
    console.log(req.body);
})

module.exports = routes;
