let keys = require('./keys');
let twitter = require('twitter');
let spotify = require('node-spotify-api');
let request = require('request');

let twitterClient = new twitter(keys.twitterKeys);
let spotifyClient = new spotify(keys.spotifyKeys);


if (process.argv.length < 3) {
    console.log('Not a valid command!!');
    return;
}

let command = process.argv[2];

switch(command) {
case 'my-tweets':
    twitterClient.get('statuses/user_timeline', {count: 20}, function(error, tweets) {
        if (!error) {
            tweets.forEach(tweet => {
                console.log(`\tCreated On: ${tweet.created_at}`);
                console.log(`\tTweet: ${tweet.text}\n`);
            });
        }
    });
    break;
case 'spotify-this-song':
    const searchKey = process.argv[3] || 'The Sign';
    spotifyClient.search({ type: 'track', query: searchKey }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
    });
    break;
case 'movie-this':
    break;
case 'do-what-it-says':
    break;
default:
    console.log(`I do not know how to help with ${command}`);
}