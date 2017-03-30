/*
-Nathan Barton
-100792105
-Thermostat.js
Thermostat acts as a client to the Furnace.js server on localhost:3000.
It also acts as the secure https server for the browser on localhost:3001.
-Cntl+C to stop server
*/


// THIS IS THE CLIENT CODE FOR THERMOSTAT//

//Thermostat variables
var desiredTemperature = 20;  //desired room temperature
var temperature        = 20;
var hysteresis         = 2.5; //thermostat hysteresis
var state              = 'ON';

//Client Variables
var http = require('http'); //need to http
var url  = require('url');  //need for url
var options1 = {            //option1 for run command to furnace
  hostname: 'localhost',
  port: '3000',
  path: '/run',
}
var options2 = {            //option2 for stop command to furnace
  hostname: 'localhost',
  port: '3000',
  path: '/stop',
}

//Determines whether furnace needs to be turned on   //
//then makes a request to the furnace server changing//
//the furnace state, which changes the increase or   //
//or decrease in temperature                         //

furnaceStatus = function()
{
    
  if(temperature < desiredTemperature - hysteresis )
  {        
     (http.request(options1, function(response){handleResponse(response);}).end());
     state = 'ON';
  }
    
  else if(temperature > desiredTemperature + hysteresis) 
  { 
     (http.request(options2, function(response){handleResponse(response);}).end()); 
     state = 'OFF';
  }
    
  if (state == 'ON') 
  {   
     console.log('temperature: ' + temperature++);
  }
    
  else if (state == 'OFF')
  {
     console.log('temperature: ' + temperature--);
  }
    
};

//sets desired temperature//

function setThermostat(temp)
{
  desiredTemperature = temp;  
}

//Handles reponse data from server//

function handleResponse(response)
{
  var serverData = '';
  console.log('Turn Furnace ');
  response.on('data', function(chunk){serverData += chunk});
  response.on('end', function(){console.log(serverData);});  
}
// running time simulation//

setInterval(function(){
   furnaceStatus();  
}, 1000);

console.log('Client Running at http://127.0.0.1:3000  CNTL-C to quit');

//END OF THERMOSTAT CLIENT CODE//
//..............................
//..............................
//..............................
//..............................
//..............................
//..............................
//START OF SERVER CODE FOR THERMOSTAT//
//Use browser to view pages at https://localhost:3001/


//server variables
var https = require('https');
var url2 = require('url');
var qstring = require('querystring');
var fs = require('fs');

//Private SSL key and signed certificate
var options3 = {
key: fs.readFileSync('serverkey.pem'),
cert: fs.readFileSync('servercert.crt')
};

// Responds to Client (browser) with an html Thermostat mock up //
// Currently setting the desired temperature is not implemented//
function sendResponse(weatherData, res){
  var page = '<html><head><title>Thermostat</title><meta http-equiv = "refresh" content = "5"/></head>' +
    '<h1> Thermostat HAL 3000 </h1>' +
    '<h2> Let the new Thermostat HAL 3000 take control... </h2>' +  
    '<body>' +  
    '<form method="post">' +
    '<button id ="Raise"> Desired Temperature</button>' +  
    '<input type = "text" name = "desiredTemp" value= ' + desiredTemperature + '/><br><br>' +
    '<input type = "text" name = "temp" readonly = "readonly" value = ' + temperature + '/><br><br><br>' +   
    'City: <input name="city"><br>' +
    '<input type="submit" value="Get Weather">' +
    '</form>';
  if(weatherData)
  {
    page += '<h1>Weather Info</h1><p>' + weatherData +'</p>';
  }
  page += '</body></html>';    
  res.end(page);
}

//parseWeather taken from class example//

function parseWeather(weatherResponse, res) 
{
  var weatherData = '';
  weatherResponse.on('data', function (chunk) {
    weatherData += chunk;
  });
  weatherResponse.on('end', function () {
    sendResponse(weatherData, res);
  });
}

//get weather from web, taken from class//

function getWeather(city, res)
{
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=' + city
  };
  http.request(options, function(weatherResponse){
    parseWeather(weatherResponse, res);
  }).end();
}

//creating secure https server taken from class//

https.createServer(options3, function (req, res) {
  console.log(req.method);
  if (req.method == "POST")
  {
    var reqData = '';
    req.on('data', function (chunk) {
      reqData += chunk;
    });
    req.on('end', function() {
      var postParams = qstring.parse(reqData);
      getWeather(postParams.city, res);
    });
  } else{
    sendResponse(null, res);
  }
}).listen(3001); //listening on port 3001//

console.log('Server Running at http://127.0.0.1:3001  CNTL-C to quit');