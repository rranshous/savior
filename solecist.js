console.log('Loading solecist');

var httpreq = require('./httpreq.js')

exports.set = function(entity_id, data, success, fail) {
  console.log('setting',entity_id,data);
  var view_schema = {
    'VERSION': 2,
    'url': 'INHERIT',
    'http_data': 'NEW'
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
  httpreq.http(options, data_string, success, fail);
  console.log('done with set');
}
