console.log('Loading function');

var redis = require("redis"),
    client = redis.createClient('redis://pub-redis-10507.us-east-1-4.6.ec2.redislabs.com:10507');
    client.auth('bow_to_savior');

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('context:', JSON.stringify(context, null, 2));

    client.set("string key", "string val", redis.print);
    client.hset("hash key", "hashtest 1", "some value", redis.print);
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    client.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });

    var page_url = event.page_url;
    delete event.page_url;

    client.lpush('all_page_urls', page_url);
    client.hset('page`'+page_url, 'url', page_url);

    console.log('page_url',page_url);
    context.succeed('v1; page_url: ' + page_url);
};
