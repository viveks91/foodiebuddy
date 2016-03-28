"use strict";
var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "ToInfinityAndBeyond" }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

require("./public/assignments/server/app.js")(app);

app.listen(port, ipaddress);