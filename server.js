// load http module
var http = require('http');
var fs = require('fs');
var url = require('url');

// create http server
http.createServer(function (req, res) {
	var request = url.parse(req.url, true);
	var action = request.pathname;

	var contentType = action.substr(action.lastIndexOf('.') + 1);
	switch(contentType) {
	case 'png':
		var img = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'image/png'});
		res.end(img, 'binary');
		break;
	case 'jpg':
		var img = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'image/jpeg'});
		res.end(img, 'binary');
		break;
	case 'gif':
		var img = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'image/gif'});
		res.end(img, 'binary');
		break;
	case 'ico':
		var img = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'image/vnd.microsoft.icon'});
		res.end(img, 'binary');
		break;
	case 'mp3':
		var sound = fs.readFileSync('.' + action);
		res.writeHead(200, {'Content-Type':'audio/mpeg'});
		res.end(sound, 'binary');
		break;
	case 'css':
		fs.readFile('.' + action, 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type':'text/css'});
			res.write(data);
			res.end();
		});
		break;
	case 'js':
		fs.readFile('.' + action, 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type':'text/javascript'});
			res.write(data);
			res.end();
		});
		break;
	default:
		fs.readFile('index.html', 'utf8', function(err, data) {
			res.writeHead(200, {'Content-Type':'text/html'});
			res.write(data);
			res.end();
		});
	}
}).listen(80, function() { console.log('local server on'); });
