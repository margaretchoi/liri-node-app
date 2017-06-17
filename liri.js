let keys = require("./keys.js");
let keysListTwitter = keys.twitterKeys;
let keysListSpotify = keys.spotifyKeys;

let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request');

let fs = require("fs");

let details = process.argv[3];

runCommand(process.argv[2]);

function runCommand(command) {
	if (command === 'my-tweets') {
		findTweets();
	}
	else if (command === 'spotify-this-song') {
		findSongs(details);
	}
	else if (command === 'movie-this') {
		findMovies(details);
	}
	else if (command === 'do-what-it-says')  {
		findWhatever();
	}
	else {
		console.log('Oops, not a valid command');
	}
}


// My Tweets
function findTweets() {
	console.log('Here are my tweets');

	let params = {
		screen_name: 'ivythepitty',
		count: 20
	}

	let client = new Twitter({
	  consumer_key: keysListTwitter.consumer_key,
	  consumer_secret: keysListTwitter.consumer_secret,
	  access_token_key: keysListTwitter.access_token_key,
	  access_token_secret: keysListTwitter.access_token_secret
	});

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		console.log(tweets[0].created_at);
		console.log(tweets[0].text);
		
		if (error) {
			console.log('Oops error!');
		}
	});

	append('my-tweets');
}


function findSongs() {

	if (details !== undefined) {
		let songName = details;
		console.log(songName);
		 
		let spotify = new Spotify({
		  id: keysListSpotify.consumer_key,
		  secret: keysListSpotify.consumer_secret
		});
		 
		spotify.search({ type: 'track', query: songName, limit: 1}, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }
			console.log('Artists: ', data.tracks.items[0].album.artists[0].name); 
			console.log('Name: ', data.tracks.items[0].album.name); 
			console.log('Preview Link: ', data.tracks.items[0].album.preview_url); 
			console.log('Album: ', data.tracks.items[0].album.name); 
		});

	} else {
		console.log('Oops, add a song name');
	}
	
	append('spotify-this-song');
} 

function findMovies() {

	if (details !== undefined) {
		let movieName = details;

		let queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

		request(queryURL, function(error, response, body) {

		  // If the request was successful...
		  if (!error && response.statusCode === 200) {
       		console.log('Title: ', JSON.parse(body).Title);
		    console.log('Release year: ', JSON.parse(body).Year);
		    console.log('Rating: ', JSON.parse(body).Ratings[0].Value);
		    console.log('Country: ', JSON.parse(body).Country);
		    console.log('Language: ', JSON.parse(body).Language);
		    console.log('Plot: ', JSON.parse(body).Plot);
		    console.log('Actors: ', JSON.parse(body).Actors);
		    console.log('Rotten Tomatoes URL: ', 'Where is it?');
		  } else {
		  	console.log('Halp, error!')
		  }

		});


	} else {
		let movieName = 'Mr. Nobody';

		let queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

		request(queryURL, function(error, response, body) {

		  // If the request was successful...
		  if (!error && response.statusCode === 200) {
       		console.log('Title: ', JSON.parse(body).Title);
		    console.log('Release year: ', JSON.parse(body).Year);
		    console.log('Rating: ', JSON.parse(body).Ratings[0].Value);
		    console.log('Country: ', JSON.parse(body).Country);
		    console.log('Language: ', JSON.parse(body).Language);
		    console.log('Plot: ', JSON.parse(body).Plot);
		    console.log('Actors: ', JSON.parse(body).Actors);
		    console.log('Rotten Tomatoes URL: ', 'Where is it?');
		  } else {
		  	console.log('Halp, error!')
		  }

		});
	}

	append('movie-this');
}

function findWhatever() {
	fs.readFile('random.txt', 'utf8', function(error, data) {
		if (error) {
    		return console.log(error);
  		} 

  		console.log(data);

  		let dataArr = data.split(',');

  		console.log(dataArr);

  		details = dataArr[1];

  		runCommand(dataArr[0]);
	});

	append('do-what-it-says');
}



function append(argv){ 	
	fs.appendFile('log.txt', argv + ', ', function(error) {

	if (error) {
		return console.log(err);
	}
	else {
		console.log("Content Added!");
	}

	});
}
