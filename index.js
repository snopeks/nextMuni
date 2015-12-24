var alexa = require('alexa-app');
var app = new alexa.app('sample');
var http = require('http');
var parseString = require('xml2js').parseString;
var token = "deec0e30-4a6f-4bec-b995-0accc4eb8b07";


app.launch(function(request,response) {
    //response.say("Hello World");
    console.log('launch request');
    //response.card("Hello World","This is an example card");
    response.say('welcome to next bus');
    response.shouldEndSession(false);
    /*
        http.get("http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx?token=deec0e30-4a6f-4bec-b995-0accc4eb8b07&stopcode=14230", function(res2) {
//http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx?token=deec0e30-4a6f-4bec-b995-0accc4eb8b07&stopcode=15002
            // This is async and will run after the http call returns 
            response.say('getting bus schedules');
            //console.log(res2);
            // Must call send to end the original request 
            response.send();
        });*/
    //});
    // Return false immediately so alexa-app doesn't send the response 
    //return false;
});

app.intent('nextBus',
  {
    "slots":{"bus":"NUMBER"}
    ,"utterances":[ "{the|when is the|when's the} next {five|twenty-one|bus}",
                    "next {five|twenty-one|bus}"]
  },
  function(request,response) {
    console.log('nextBus')
    //5
    //http://services.my511.org/Transit2.0/GetNextDeparturesByStopName.aspx?token=deec0e30-4a6f-4bec-b995-0accc4eb8b07&agencyName=SF-MUNI&stopName=Fulton%20St%20and%20Masonic%20Ave
    //43
    //http://services.my511.org/Transit2.0/GetNextDeparturesByStopName.aspx?token=deec0e30-4a6f-4bec-b995-0accc4eb8b07&agencyName=SF-MUNI&stopName=Masonic%20Ave%20and%20Hayes%20St
    //21
    //http://services.my511.org/Transit2.0/GetNextDeparturesByStopName.aspx?token=deec0e30-4a6f-4bec-b995-0accc4eb8b07&agencyName=SF-MUNI&stopName=Hayes%20St%20and%20Masonic%20Ave
    var buses = {
        'five':{
            'agencyName': 'SF-MUNI',
            'stopName':'Fulton St and Masonic Ave'
        },
        'twenty-one': {
            'agencyName': 'SF-MUNI',
            'stopName':'Hayes St and Masonic Ave'
        },
        'fourty-three': {
            'agencyName': 'SF-MUNI',
            'stopName':'Masonic Ave and Hayes St'
        }
    }
    var bus = request.slot('bus');
    var getSchedule = false;
    var url = "http://services.my511.org/Transit2.0/GetNextDeparturesByStopName.aspx?token=" + token + "&agency=SF-MUNI&stopName=";
    console.log(bus);
    if(bus === "5" || bus === "five"){
        getSchedule = true;
        url += buses[bus]['stopName']
    } else if (bus === "21" || bus === "twenty-one") {
        getSchedule = true;
        url += buses[bus]['stopName'];
    } else if (bus === "43" || bus === "fourty-three") {
        getSchedule = true;
        url += buses[bus]['stopName'];
        //response.say('Sorry, did not understand that');
    }
    
    if(getSchedule) {
        url = encodeURIComponent(url);
        console.log(url);
        http.get(url, function(res) {
        //console.log(res)
        //console.log(body)
        var buffer = "";
        res.on( "data", function( data ) { buffer = buffer + data; } );
        res.on( "end", function( data ) { 
            //console.log( buffer.toString() ); 
            //response.send();
            parseString(buffer.toString(), function (err, result) {
                console.log(JSON.stringify(result));
                
                //var arriving = result['RTT']['AgencyList'][0]['Agency'][0]['RouteList'][0]['Route'][0]['RouteDirectionList'][0]['RouteDirection'][0]['StopList'][0]['Stop'][0]['DepartureTimeList'][0]['DepartureTime'][0];
                /*console.log(arriving);
                if(five) {
                    var fiveR = "never";
                    //var fiveR = result['RTT']['AgencyList'][0]['Agency'][0]['RouteList'][0]['Route'][1]['RouteDirectionList'][0]['RouteDirection'][0]['StopList'][0]['Stop'][0]['DepartureTimeList'][0]['DepartureTime'][0];
                    response.say('Next 5 fulton bus is arriving in ' + arriving + ' minutes and the 5 R is arriving in ' + fiveR + ' minutes.')
                } else {
                    response.say('Next 21 Hayes bus is ' + arriving + ' minutes away!');
                }*/
                response.send();
            });
        
        } );
        });
    };
    // Return false immediately so alexa-app doesn't send the response 
    return false; 
  }
);
app.sessionEnded(function(request,response) {
    // No response necessary
    console.log('session end'); 
});

exports.handler = app.lambda();

console.log(app.utterances());
console.log(app.schema());
//console.log(app.launch())