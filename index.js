var http = require('http')
var request = require('request')
var argv = require('yargs')
			.usage('Usage: $0 [Options]')
			.alias('p', '--port')
			.describe('p', 'Specify a forwarding port')
			.alias('x', '--host')
			.describe('x', 'Specify a forwarding host')
			.alias('e', '--exec')
			.describe('e', 'Specify a process to proxy instead')
			.alias('l', '--log')
			.describe('l', 'Specify a output log file')				
			.help('h')
			.alias('h', 'help')
			.epilog('copyright 2016')
			.argv
var fs = require('fs')

var logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : : process.stdout
var schema = 'http://'
var localhost = '127.0.0.1'
var host = argv.host || localhost
var port = argv.port || ((localhost === host) ? 8000 : 80)
var destinationUrl = schema + host + ':' + port || argv.url

var echoServer = http.createServer((req, res) => {
	
	logStream.write('Echo Server\n')
	logStream.write(JSON.stringify(req.headers) + '\n')
	
	for(var header in req.headers)
		res.setHeader(header, req.headers[header])
		
	req.pipe(res)
})
echoServer.listen(8000)
logStream.write('Echo Server listening at http://127.0.0.1:8000 \n')

var proxyServer = http.createServer((req, res) => {
	
	logStream.write('Proxy Server\n')
	logStream.write(JSON.stringify(req.headers) + '\n')
	
	var url = destinationUrl
	
	if(req.headers['x-destination-url'])
		url = 'http://' + req.headers['x-destination-url']
		
	var options = {
		url : url + req.url
	}
	
	req.pipe(request(options)).pipe(res)
	
})
proxyServer.listen(9000)
logStream.write('Proxy Server listening at http://127.0.0.1:9000 \n')

