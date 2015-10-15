console.log('Loading function');

var http = require("http");
var url = require('url');

var publish = function(key, data, success, fail) {
  console.log('publishing',key,data);
  var base_url = "http://savior-kinfire.forebodingflavor.com/";
  var data_string = JSON.stringify(data);
  var options = {
    hostname: 'savior-kinfire.forebodingflavor.com',
    port: 80,
    path: '/'+key,
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
      console.log('publish success');
      success(result);
    });
  });
  req.on('error', function(err) {
    console.log('publish fail',err);
    fail(err);
  });
  req.write(data_string);
  req.end();
}

var set = function(entity_id, data, success, fail) {
  console.log('setting',entity_id,data);
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

exports.page_intake = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('context:', JSON.stringify(context, null, 2));

  var page_url = event.page_url;
  delete event.page_url;
  console.log('page_url',page_url);
  var hostname = url.parse(page_url).hostname;
  console.log('page hostname', hostname);

  console.log('setting keys');
  var page_url_encoded = new Buffer(page_url).toString('base64');
  set(page_url_encoded, { url: page_url }, function() {
    console.log('done setting keys');
    publish(hostname, { type: 'page_intake', page_url: page_url }, function() {
      console.log('done publishing');
      context.succeed('v7; page_url: ' + page_url);
    }, context.fail);
  }, context.fail);
};

exports.handle_events = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  event.Records.forEach(function(record) {
      console.log('handling record', record);
      var payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
      console.log('Decoded payload:', payload);
  });
  context.succeed("Successfully processed " + event.Records.length + " records.");
}
