console.log('Loading httpreq');

var http = require('follow-redirects').http

exports.http = function(options, body, success, fail) {
  var result;
  var req = http.request(options, function(res) {
    var body = '';
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    if(res.statusCode == 500) {
      console.error('bad status, fail');
      fail(500);
      return;
    };
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      console.log('Successfully processed HTTP response');
      // If we know it's JSON, parse it
      if (res.headers['content-type'] === 'application/json') {
        result = JSON.parse(body);
      } else { result = body; };
      success(result, res.headers, res.statusCode);
    });
  });
  req.on('error', fail);
  if(body) { req.write(body); }
  req.end();
  console.log('done with http req');
}
