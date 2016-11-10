var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(3032, function () {
    console.log('Springblock API running on port 3032')
})
