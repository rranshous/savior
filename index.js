console.log('Loading function');

var http = require("http");
var url = require('url');
var kinfire = require('./kinfire.js');
var solecist = require('./solecist.js');
var httpreq = require('./httpreq.js');

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
  solecist.set(page_url_encoded, { url: page_url }, function() {
    console.log('done setting keys');
    kinfire.publish(hostname,
      { type: 'page_intake',
        page_url: page_url,
        hostname: hostname,
        page_url_encoded: page_url_encoded },
      function() {
        console.log('done publishing');
        context.succeed('v8; page_url: ' + page_url);
      },
      context.fail
    );
  }, context.fail);
};

exports.handle_events = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  event.Records.forEach(function(record) {
      console.log('handling record', record);
      var payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
      console.log('Decoded payload:', payload);
      var data = JSON.parse(payload);
      console.log('Parsed data:', data);
      handle_event(data, context.succeed, context.fail);
  });
}

var handle_event = function(data, succeed, fail) {
  switch(data.type) {
    case 'page_intake':
      console.log('handling page intake');
      httpreq.http(data.page_url, '', function(r) {
        console.log('page response:',r.length);
        var encoded_response_data = new Buffer(r).toString('base64');
        solecist.set(data.page_url_encoded, { http_data: encoded_response_data },
                     succeed, fail);
      }, fail);
      break;
    default:
      console.log('handling default');
      console.error('unknown event', data);
  }
}
