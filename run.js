var kinfire = require('./kinfire.js');
var solecist = require('./solecist.js');

solecist.set('test-2', { url: 'success2' }, function() { console.log('success'); },
                                           function() { console.log('failure'); });
