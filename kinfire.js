console.log('Loading publish');

var httpreq = require('./httpreq.js');

exports.publish = function(key, data, success, fail) {
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
  httpreq.http(options, data_string, success, fail);
}
