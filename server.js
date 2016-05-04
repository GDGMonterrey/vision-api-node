'use strict'

require('dotenv').config();

const express = require('express');

const app = express();

const path = require('path');

const multer = require('multer');

const vision = require('node-cloud-vision-api');

const upload = multer({ dest: 'uploads/' });

app.use(express.static(__dirname + '/frontend'));

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

const apiRouter = express.Router();

vision.init( { auth: process.env.API_KEY } );

apiRouter.route('/').post(upload.single('file'),function(req, res) {
	let pathTemp = req.file.path;
	const request = new vision.Request({
	  image: new vision.Image(pathTemp),
	  features: [
	  	new vision.Feature('LABEL_DETECTION', 1)
	  ]
	});
	vision.annotate(request).then((response) => {
  	res.send(JSON.stringify(response.responses));
	}, (e) => {
	  console.log('Error: ', e);
	  res.send("fuck");
	});
	
});

app.use('/api', apiRouter);

app.listen(3000);

console.log('Lets node');
