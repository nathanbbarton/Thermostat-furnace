/*
-Nathan Barton
-100792105
-Furnace.js
Furnace acts as a server to the Thermostat.js.
It sends messages to thermostat over localhost:3000.
-Cntl+C to stop server
*/

//server variables//

var http     = require('http'); //need to http
var fs       = require('fs'); //need to read static files
var url      = require('url');
var ROOT_DIR = 'html'; //dir for static files
var qstring  = require('querystring');

var isRunning = 'ON';//furnace ON/OFF variable

function turnON() {isRunning = 'ON';} //furnace state toggle functions//
function turnOFF(){isRunning = 'OFF';}


//create a server GET example from class//

http.createServer(function (request, response) {
     var urlObj   = url.parse(request.url, true, false);
     var query    = urlObj.query;
   
     console.log("PATHNAME: " + urlObj.pathname);   
     response.writeHead(200, {'Content-Type': 'text/html'});
    
     if (urlObj.pathname == '/run'){
         turnON();
         console.log('Furnace has been turned ' + isRunning); 
     }
     else if (urlObj.pathname == '/stop'){
         turnOFF();  
         console.log('Furnace has been shut ' + isRunning); 
     }
     response.write(isRunning);
     response.end(' Message Received');
     
}).listen(3000);//listening on port 3000

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');

