let keys = require('./keys');
let twitter = require('twitter');
let spotify = require('node-spotify-api');
let request = require('request');
let fs = require('fs');
const { exec } = require('child_process');

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
    const searchKey = process.argv[3] || 'The Sign by Ace of Base';
    spotifyClient.search({ type: 'track', query: searchKey, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        if (data.tracks && data.tracks.items && data.tracks.items.length) {
            const songData = data.tracks.items[0];
            console.log('Artists : ' + songData.album.artists.map(function(artist){ return artist.name; }).join());
            console.log('Song Name: ' + searchKey);
            console.log('Preview Link ' + songData.album.external_urls.spotify);
            console.log('Album Name: ' + songData.album.name);
            
        } else {
            console.log('There are no songs with the name ' + searchKey);
        }
    });
    break;
case 'movie-this':
    const movieSearchKey = process.argv[3] || 'Mr. Nobody';
    request.get("http://www.omdbapi.com/?i=tt3896198&apikey=ee8f4efb&t=" + movieSearchKey, (error, response) => {
        if (error) {
            console.log('Error occurred: ' + error)
            return;
        }

        response = JSON.parse(response.body);

        let rotenRating = response.Ratings.filter(function(rating) { return rating.Source === "Rotten Tomatoes"; });
        if(rotenRating && rotenRating.length) {
            rotenRating = rotenRating[0];
        } else {
            rotenRating = {Value: 'Not Available'}
        }

        console.log('Title of the movie: ' + response.Title);
        console.log('Year the movie came out: ' + response.Year);
        console.log('IMDB Rating of the movie: ' + response.imdbRating);
        console.log('Rotten Tomatoes Rating of the movie: ' + rotenRating.Value);
        console.log('Country where the movie was produced: ' + response.Country);
        console.log('Language of the movie: ' + response.Language);
        console.log('Plot of the movie: ' + response.Plot);
        console.log('Actors in the movie: ' + response.Actors);
      });
    break;
case 'do-what-it-says':
    var randomText = '';
    if (fs.existsSync('random.txt')) {
        randomText = fs.readFileSync('random.txt', 'utf8');
    }

    if (randomText) {
        randomText = randomText.split(',');
        if (randomText.length === 2) {
            console.log("node liri.js " + randomText[0] + " " + randomText[1]);
            exec("node liri.js " + randomText[0] + " " + randomText[1], (err, stdout, stderr) => {
                if (err) {
                    console.log('Error occurred: ' + error)
                    return;
                }

                console.log(stdout);

                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
              });
        } else {
            console.log('Command improper format');            
        }
    } else {
        console.log('No commands to execute');
    }
    break;
default:
    console.log(`I do not know how to help with ${command}`);
}