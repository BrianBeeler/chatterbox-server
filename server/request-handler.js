var resultObj = {};
resultObj.results = [];

exports.requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;
  var body = "";

  var headers = {
  "access-control-allow-origin":  "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
  };

  var completeHead = function(response, statusCode) {
    statusCode = statusCode || 404;
    response.writeHead(statusCode, headers);
  }

  var actions = {
    'GET': function () {
      completeHead(response,200);
      response.end(JSON.stringify(resultObj));
    },
    'POST': function () {
       completeHead(response, 201);
       request.on('data', function(chunk) {
         body += chunk;
       });
       request.on('end', function() {
         var parsedBody = JSON.parse(body);
         resultObj.results.push(parsedBody);
         response.end(JSON.stringify({success: true}));
       })
    },
    'ERROR': function () {
      completeHead(response, 404);
      response.end(JSON.stringify({success: false}));
    }
  }

  if (request.url !== '/classes/messages') {
    actions.ERROR();
  }
  if(request.method === 'POST') {
    actions.POST();
  }
  else if(request.method === 'GET') {
    actions.GET()
  }
};



