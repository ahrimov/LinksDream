var express = require('express')
var app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var port = 3000;


app.use(express.static(__dirname));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/login.html');
})



app.listen(port, () => {
	console.log('Starting server on port: ' + port)
})