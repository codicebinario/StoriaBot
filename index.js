




var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))



var jsonParser = bodyParser.json();
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})





// for Facebook verification
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'storia') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})





// Spin up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))

})


app.post('/webhook', jsonParser, function (req, res) {
    messaging_events = req.body.entry[0].messaging


    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text


            if (text.toLowerCase() === 'news') {
                sendGenericMessage(sender)

                //  sendGenericMessageHelp(sender)

                continue
            }

            if (text.toLowerCase() === 'accadde oggi') {
                sendGenericAccaddeOggi(sender)

                //  sendGenericMessageHelp(sender)

                continue
            }


            else if (text.toLowerCase() === 'help') {
                sendGenericMessageHelp(sender)

                continue
            }
            sendTextMessage(sender, "Hai scritto " + text.substring(0, 200) + ", non è un comando valido. Se hai bisogno scrivi Help")


        }

        if (event.postback) {
            var text = JSON.stringify(event.postback.payload)
            if (text.toLowerCase() === "\"inizia\"") {
                sendTextMessage(sender, "Benvenuto, digita News", token)
                SaveSender(sender)
                continue

            }
            else if (text.toLowerCase() === "\"start\"") {
                sendTextMessage(sender, "Benvenuto, digita News", token)
                continue

            }
            else if (text.toLowerCase() === "\"news\"") {
                sendGenericMessage(sender)
                //	sendGenericMessageHelp(sender)
                continue

            }

            else if (text.toLowerCase() === "\"accadde\"") {
                sendGenericAccaddeOggi(sender)
                //	sendGenericMessageHelp(sender)
                continue

            }

                /* 	 	else if (text.toLowerCase() === "\"guida tv\"") {
                            
                            //  vedere come fare 
                sendGenericGuidaTV(sender)
                //	sendGenericMessageHelp(sender)
                                continue
        
                     } */



            else if (text.toLowerCase() === "\"help\"") {
                sendGenericMessageHelp(sender)
                continue

            }

            else if (text.toLowerCase() === "\"Disattiva\"") {
                sendDisattiva(sender)
                continue

            }

        }

    }

    res.sendStatus(200)
})

var token = "EAANch1rmYo4BAL2sV5DJ2I5ZARxW7XtNNMAfvZC38roeyL8FMDxz0ZA1iEfFfBFdwfYFk84m4QypJJZAC97woOqzB1JCM4y6ditMh24v4PcUx2EaKnaoLirwzdkcF0hCEvkXWDqZCRUJde1Pt8FzL875nL9OzPUEZD"

function sendTextMessage(sender, text) {

    let messageData = { text: text }
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendDisattiva(sender) {

    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements":

			  [{
			      "title": "Help",
			      "subtitle": "Scrivi Novità per ricevere le ultime notizie da Rai Storia"

			  }, {

			      "title": "Disattiva",
			      "subtitle": "Scrivi Disattiva per non ricevere più messaggi"

			  }]


            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'DELETE',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}


function sendGenericMessageHelp(sender) {

    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements":

			  [{
			      "title": "News",
			      "subtitle": "Scrivi News per ricevere le ultime notizie da Rai Storia"

			  }, {

			      "title": "Accadde Oggi",
			      "subtitle": "Scrivi Accadde Oggi per ricevere avvenimenti del giorno"

			  }

, {

    "title": "Guida TV",
    "subtitle": "Scrivi Guida TV per vedere la programmazione di oggi"

}

, {

    "title": "Disattiva",
    "subtitle": "Scrivi Disattiva per non ricevere più messaggi"

}


			  ]


            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}
var elements = "";
function accaddeoggi() {

    var request = require('request');
    request('http://www.raistoria.rai.it/bot-accaddeoggi.aspx', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            elements = body;
            console.log(body)
        }
    })


}

function sendGenericAccaddeOggi(sender) {


    accaddeoggi();
    //storia();
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements":

			elements
                /* [{"title":"Apertura della Camera del Parlamento Subalpino","subtitle":"Da venerdì 17 a domenica 19 marzo 2017, in occasione della Giornata dell'Unità nazionale, il Museo Nazionale del Risorgimento Italiano riaprirà alla visita del pubblico, dopo circa 30 anni, la Camera dei deputati del Parlamento Subalpino.","image_url":"http://www.educational.rai.it/materiali/immagini_articoli/36517.jpg","buttons":[{"type":"web_url","url":"http://www.raistoria.rai.it/articoli/apertura-della-camera-del-parlamento-subalpino/36517/default.aspx","title":"Apertura della Camera del Parlamento Subalpino"},{"type":"element_share"},{"type":"postback","title":"Ultime notizie","payload":"News"}]},{"title":"L’Europa e la Chiesa","subtitle":"Quando si comincia a parlare di un’Europa unita, alla fine del secondo conflitto mondiale, sul soglio pontificio siede Pio XII, favorevole alla formazione di questo nuovo soggetto politico. ","image_url":"http://www.educational.rai.it/materiali/immagini_articoli/600300PRO/36515_600300PRO.jpg","buttons":[{"type":"web_url","url":"http://www.raistoria.rai.it/articoli/l%E2%80%99europa-e-la-chiesa/36515/default.aspx","title":"L’Europa e la Chiesa"},{"type":"element_share"},{"type":"postback","title":"Ultime notizie","payload":"News"}]},{"title":"Beppe Fenoglio, da partigiano a scrittore","subtitle":"Fotografie tratte dall’album di famiglia di Beppe Fenoglio (1 marzo 1922 - 18 febbraio 1963) aprono questo video, dedicato in particolare alla partecipazione dello scrittore alla resistenza partigiana.","image_url":"http://www.educational.rai.it/materiali/immagini_articoli/1036.jpg","buttons":[{"type":"web_url","url":"http://www.raistoria.rai.it/articoli/beppe-fenoglio-da-partigiano-a-scrittore/1036/default.aspx","title":"Beppe Fenoglio, da partigiano a scrittore"},{"type":"element_share"},{"type":"postback","title":"Ultime notizie","payload":"News"}]}] */

            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}

function storia() {

    var request = require('request');
    request('http://www.raistoria.rai.it/bot-response.aspx', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            elements = body;
            console.log(body)
        }
    })


}

function sendGenericMessage(sender) {
    storia();
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements":

			elements


            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}

function SaveSender(sender) {
    console.log("SaveSender start: " + sender)
    var http = require('http');
    var data = JSON.stringify({
        'sender': sender
    });

    var options = {
        host: 'http://www.raistoria.rai.it',
        port: '80',
        path: '/StoriaBot/save_sender.aspx',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.length
        }
    };

    var req = http.request(options, function (res) {
        var msg = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            msg += chunk;
            console.log("response: " + chunk);
        });
        res.on('end', function () {
            console.log(JSON.parse(msg));
        });
    });

    req.write(data);
    req.end();
    console.log("SaveSender end: " + sender)

    /*var fs = require('fs');
    fs.writeFile("/tmp/senders", sender, function (err) {
        if (err) {
            return console.log("Error saving file: " + err);
        }
        console.log("The file was saved: sender id = " + sender);
        setTimeout(function () { sendGenericAccaddeOggi(sender); }, 30000)
    });*/
}



