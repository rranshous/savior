console.log('Loading function');

var http = require("http");

var set = function(entity_id, data, success, fail) {
  console.log('setting',entity_id,data);
  var base_url = "http://page-solecist.forebodingflavor.com/"
  var view_schema = {
    'VERSION': 1,
    'url': 'NEW'
  };
  var metadata = {};
  var post_data = {
    'data': data,
    'view_schema': view_schema,
    'metadata': metadata
  };
  var data_string = JSON.stringify(post_data);
  var options = {
    hostname: 'page-solecist.forebodingflavor.com',
    port: 80,
    path: '/'+entity_id,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data_string.length
    }
  };
  var result;
  var req = http.request(options, function(res) {
    var body = '';
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      console.log('Successfully processed HTTPS response');
      // If we know it's JSON, parse it
      if (res.headers['content-type'] === 'application/json') {
        result = JSON.parse(body);
      }
      success(result);
    });
  });
  req.on('error', fail);
  req.write(data_string);
  req.end();
  console.log('done with set');
}

exports.handler = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('context:', JSON.stringify(context, null, 2));

  var page_url = event.page_url;
  delete event.page_url;
  console.log('page_url',page_url);

  console.log('setting keys');
  var page_url_encoded = new Buffer(page_url).toString('base64');
  set(page_url_encoded, { url: page_url }, function() {
    console.log('done setting keys');
    context.succeed('v6; page_url: ' + page_url);
  }, context.fail);
};
