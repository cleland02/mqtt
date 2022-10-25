const mqtt = require('mqtt')
const options={
    port:'1883',
    clientId:"123123",
    username:"FlespiToken JBHYSc5OysxtU0wUsIt7Lfp6FHibONhneO9WQ4yckUu5IQP0m6VY9bUDG1ElCKwE",
    password:"",
    clean:true};
const client  = mqtt.connect('mqtt://mqtt.flespi.io',options)

client.on('connect', function () {
  client.subscribe('flespi/message/gw/devices/4662532', function (err) {
    if (!err) {
      //client.publish('presence', 'Hello mqtt')
      console.log("conexión exitosa")
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  //client.end()
})