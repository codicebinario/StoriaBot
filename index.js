 

 

 
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))



var jsonParser = bodyParser.json();
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

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
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
	
})



/* app.post('/webhook',jsonParser, function (req, res) {
    messaging_events = req.body.entry[0].messaging
	//console.log("app.post ran")
	// if (messaging_events!=null) {
		for (i = 0; i < messaging_events.length; i++) {
			event = req.body.entry[0].messaging[i]
			sender = event.sender.id
			//sendTextMessage(sender, "1", token)
			if (event.message && event.message.text) {
			//	sendTextMessage(sender, "2", token)
				text = event.message.text
				if (text === 'hi') {
					sendGenericMessage(sender)
					continue
				}
				sendTextMessage(sender, "parrot: " + text.substring(0, 200))
			}
		//	sendTextMessage(sender, "3", token)
			if (event.postback) {
				text = JSON.stringify(event.postback)
				sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
				continue
			}
		//	sendTextMessage(sender, "4 ", token)
		}
	
    res.sendStatus(200)
}) */
		
	
 /* app.post('/webhook',jsonParser, function (req, res) {
 messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'ciao') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Rai Cultura: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
}) */

	
		

 app.post('/webhook',jsonParser, function (req, res) {
    messaging_events = req.body.entry[0].messaging
	
   
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i]
		sender = event.sender.id
		if (event.message && event.message.text) {
            text = event.message.text
			
			
			 if (text.toLowerCase() === 'ultime notizie') {
              sendGenericMessage(sender)
			  
			 //  sendGenericMessageHelp(sender)
			
             continue
            }
			
			  else if  (text.toLowerCase() === 'help') {
             sendGenericMessageHelp(sender)
			
              continue
            } 
		    sendTextMessage(sender, "Hai scritto " + text.substring(0, 200) + ", non è un comando valido. Se hai bisogno scrivi Help")
        
			
        } 
		 
		if (event.postback) {
		var text = JSON.stringify(event.postback.payload)
			if(text.toLowerCase() === "\"inizia\""){
			sendTextMessage(sender, "Benvenuto, digita Ultime Notizie", token)
			  			continue

			}
			else if (text.toLowerCase() === "\"start\""){
			sendTextMessage(sender, "Benvenuto, digita Ultime Notizie", token)
			 			continue

			}
			else if (text.toLowerCase() === "\"news\"") {
        sendGenericMessage(sender)
		//	sendGenericMessageHelp(sender)
						continue

			 }
			
			else if (text.toLowerCase() === "\"help\""){
			sendGenericMessageHelp(sender)
			 			continue

			}
			
			else if (text.toLowerCase() === "\"Disattiva\""){
			sendDisattiva(sender)
			 			continue

			}
			
		}
		
	}	
   
    res.sendStatus(200)
})

var token = "EAANch1rmYo4BAL2sV5DJ2I5ZARxW7XtNNMAfvZC38roeyL8FMDxz0ZA1iEfFfBFdwfYFk84m4QypJJZAC97woOqzB1JCM4y6ditMh24v4PcUx2EaKnaoLirwzdkcF0hCEvkXWDqZCRUJde1Pt8FzL875nL9OzPUEZD"

function sendTextMessage(sender, text) {
	
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}








	var elements = "";
  function storia() {
		  
		  	var request = require('request');
			request('http://www.raistoria.rai.it/bot-response.aspx', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					elements = body;
				console.log(body) 
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
"title":"Help",
"subtitle":"Scrivi Novità per ricevere le ultime notizie da Rai Storia"

			  },  {

"title":"Disattiva",
"subtitle":"Scrivi Disattiva per non ricevere più messaggi"

}]

				
            } 
        }
    }
     request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'DELETE',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
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
"title":"Help",
"subtitle":"Scrivi Novità per ricevere le ultime notizie da Rai Storia"

			  },  {

"title":"Disattiva",
"subtitle":"Scrivi Disattiva per non ricevere più messaggi"

}]

				
            } 
        }
    }
     request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
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
				// [{
// "title":"Rai Storia",
// "subtitle":"La guerra del Vietnam",
// "image_url":"http://www.educational.rai.it/materiali/immagini_gallery/17627.jpg",
// "buttons":[{
// "type":"web_url",
// "url":"http://www.raistoria.rai.it/gallery-refresh/una-bambina-e-la-guerra/1435/5/default.aspx#header",
 // "title": "Una bambina e la guerra"
// },{
// "type":"web_url",
// "url":"http://www.raistoria.rai.it/gallery-refresh/una-bambina-e-la-guerra/1435/6/default.aspx#header",
 // "title": "Una bambina e la guerra"
// },{
// "type":"web_url",
// "url":"http://www.raistoria.rai.it/gallery-refresh/una-bambina-e-la-guerra/1435/11/default.aspx",
 // "title": "Una bambina e la guerra"
// }]
// }]
				
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}


