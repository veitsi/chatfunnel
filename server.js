var express = require('express'); //express handles routes
var http = require('http'); //need http module to create a server
var bodyParser = require('body-parser')
var request = require('request')
var app = express(); //starting express
app.set('port', process.env.PORT || 3000); //set port to cloud9 specific port or 3000
app.use(express.bodyParser()); //body parser used to parse request data
app.use(app.router);
app.get('/', verificationHandler);
app.post('/', handleMessage);
//app.get('/',handleMessage);
var token = "EAAH4IuWa9ZAgBAM0nv9Hfs1ZAoDraPpfHLTLQcKv218Y9yftnZAMlsZCyHISmZCbLaYG4sNHdZBBZBhCMwEltw8uCIfd9LKRNOQl5ZAPraPrpyGHZCXgWZBUGZBhuMqmZBJRa8RUGb2DnLl3fxB16eppeShrjWIvS3rvtGQiMSo9ouIL9AZDZD";
var status = 0;
var Storage = require('node-storage');
Storage.prototype.isEmpty = function(prop) {
    return typeof(this.get(prop)) === 'undefined';
}
var users = new Storage('users.txt');
var actions = require('./actions');

function handleMessage(req, res) {
    console.log('in handleMessage, actions');
    var messaging_events = req.body.entry[0].messaging;
    var stage;
    var action;
    function nextStage(stage){
        console.log(stage)
            users.put(sender+'.stage',stage);
            action=actions[users.get(sender+'.stage')];
            console.dir(action);
            if ('phrase' in action) {sendTextMessage(sender, action['phrase'])}
            if ('delay' in action && 'nextStage' in action){setTimeout(nextStage,action.delay,action.nextStage)}
    }
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        text = event.message.text;
        
        if (event.message && event.message.text) {
            if (users.isEmpty(sender)) { //new user joined
                console.log('new user joined ' + sender);
                users.put(sender, {});
                nextStage('start');
            }
            else{
                action=actions[users.get(sender+'.stage')];
                if ('answers' in action && text in action.answers){
                    nextStage(action.answers[text]);
                }
                else{
                  console.log(sender, "unrecognized answer");
                }
            }
            console.log(text, sender);
        }
    }
    res.end('received!');
}

function getResponse(message) {
    for (var i = 0; i < r.length; i++) {
        for (var j = 0; j < r[i].keywords.length; j++) {
            if (message.toLowerCase().indexOf(r[i].keywords[j]) != -1) {
                console.log("Responding to message: " + message);
                return r[i].messages[Math.floor(Math.random() * r[i].messages.length)];
            }
        }
    }
}

function verificationHandler(req, res) {
    console.log(req);
    if (req.query['hub.verify_token'] === 'verifycode') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token!');
}

function sendTextMessage(sender, text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var r = [{
    "keywords": ["hello", "привет"],
    "messages": [
        "Hello, nigga",
        "Wazzzup!!!",
        "Hello",
        "How do you do",
        "Hi!",
        "Hello my slave, respect my power!"
    ]
}, ];