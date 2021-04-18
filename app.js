/******************************Load Packages*****************************/
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const exceljs = require('exceljs');
const fs = require('fs');
const cron = require('node-cron');
const {google} = require('googleapis');
const pino = require('pino');
const errorHandler = require('errorhandler');

const pinoms = require('pino-multi-stream');
const stream = require('stream');
var prettyStream = pinoms.prettyStream();
var streams = [
  {level: 'error', stream: fs.createWriteStream('./logs/error.log', {flags: 'a'})},
  {level: 'info', stream: fs.createWriteStream('./logs/debug.log', {flags: 'a'})},
  {stream: prettyStream }
]
var logger = pinoms(pinoms.multistream(streams));

const config = require('./config_local.json') //localhost
//const config = require('./config_test.json') //tactics_test
//const config = require('./config_deployed.json') //tactics_deployed

/*****************************Define Variables***************************/
const hostname = config["HOST_NAME"];
const port = config["HOST_PORT"];
__dirname = config["HOST_DIR"];
const key = config["GGL_SERVICE_KEY"];

/****************************Manage DB Connection***********************/
var db_config = {
	connectionLimit: 50,
	host: config["MY_SQL_HOST"],
	user: config["MY_SQL_USER"],
	password: config["MY_SQL_PW"],
	database: config["MS_SQL_DB"]
};
var pool = mysql.createPool(db_config);
/****************************Create/Manage Server Middleware***********************/
var app = express();
app.use('/static', express.static('static'));
app.use('/static/tactic_pictures/', express.static('static'));
app.use('/static/site_pictures/', express.static('static'));
app.set('views', './templates');
app.use(bodyParser.json());

//load nunjucks html templating
nunjucks.configure('templates/', {
    autoescape: true,
    express: app
});

//run app
var server = app.listen(port, hostname, function() {
	console.log('Listening!');
});

/****************************Functions and Queries***********************/
//log each http request and response
function logHTTPResponse(req, res){
	logger.debug(req + " / " + res);
}

//cron job to asynchronously pull new/updated pictures from google drive folder to server for display on site on weekly basis
function syncFromDive(){
	const SCOPES = ['https://www.googleapis.com/auth/drive'];

	authorize(null, downloadPictures);

    function authorize(credentials, callback) {
        const scopes = 'https://www.googleapis.com/auth/drive';
        const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)

        jwt.authorize((err, response) => {
            if (err) logger.error("Error: " + err);
            if (response) callback(jwt);
        });
    }

    function downloadPictures(jwt){
    	const drive = google.drive({version: 'v3', 
    		auth: jwt,
    		params: {
    			key: config["GGL_API_KEY"]
			}});
    	drive.files.list({
    		auth: jwt,
    		corpora: 'drive',
			supportsAllDrives: true,
			includeItemsFromAllDrives: true,
			driveId: config["GGL_DRIVE_ID"],
			q: "'1DcEcTtM6SagDHdFT4rMmjuMZ_ab1Yw9B' in parents and trashed=false and mimeType='image/jpeg'",
			fields: 'files(name, mimeType, id, modifiedTime, createdTime)'
		}, (err, res) => {
			if (err) return logger.error("Drive API Error: " + err);
			const files = res.data.files;
			if (files.length) {
				loopAllPictures(files, drive, jwt);
		    } else {
		    	logger.error("No Files Found in Drive Folder");
		    }
		});
    }

    async function loopAllPictures(files, drive, jwt){
		for(const file of files){
			var fileEditedTime;
			if(file.modifiedTime > file.createdTime){
				fileEditedTime = new Date(Date.parse(file.modifiedTime));
			}else{
				fileEditedTime = new Date(Date.parse(file.createdTime));
			}
			var today = new Date();
			var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, today.getHours(), today.getMinutes());
			if(fileEditedTime > date){
				logger.info(file.name);
    			var dest = fs.createWriteStream('./static/tactic_pictures/'+file.name);
    			try {
    				await getPictures(drive, jwt, file.id, dest);
    			}
    			catch(error){
    				logger.error("Drive API Error: " + err);
    			}
    		}
    	};
    }

    async function getPictures(drive, jwt, id, dest){
        	const res = await drive.files.get({fileId: id, alt: 'media', mimeType: 'image/jpeg', supportsAllDrives: true},
        		{responseType: 'stream'});
        	return new Promise((resolve, reject) => {
			    res.data
			      .on('error', reject)
			      .pipe(dest)
			      .on('error', reject)
			      .on('finish', resolve);
			  });
    }
}

//categoryTactics
const getCategoryTactics = (next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
			'SELECT a.name, a.persuasive, a.coercive, c.parent_categories FROM (SELECT t.* FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
				'WHERE (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) a LEFT JOIN categories c ' +
				'ON a.category_submedium = c.category_id', (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				resolve(result);
				connection.release(err => {
					if(err){
						next(err);
						logger.error("Error: " + err);
					}
				});
			}
		});
	});
});

//categoryList
const getCategoryList = (next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
		'SELECT DISTINCT(a.name), a.tactic_id, a.picture, a.summary, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM ' + 
			'(SELECT t.name, t.tactic_id, t.picture, t.summary, t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id) a LEFT JOIN categories c ' +
			'ON a.category_submedium = c.category_id', (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				resolve(result);
				connection.release(err => {
					if(err){
						next(err);
						logger.error("Error: " + err);
					}
				});
			}
		});
	});
});

//siteText
const getSiteText = (req, next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
		'SELECT text FROM site_text WHERE page = ? AND section = ?', [req.body['value'][0], req.body['value'][1]], (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				resolve(result);
				connection.release(err => {
					if(err){
						next(err);
						logger.error("Error: " + err);
					}
				});
			}
		});
	});
});

//tacticsDB
const getTacticsDB = (next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
		'SELECT DISTINCT(a.name), a.tactic_id, a.picture, a.summary, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM ' + 
			'(SELECT t.name, t.tactic_id, t.picture, t.summary, t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
			'WHERE (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) a LEFT JOIN categories c ' +
			//'ON a.category_submedium = c.category_id ORDER BY a.name ASC', (err, result) => {
			'ON a.category_submedium = c.category_id ORDER BY a.tactic_id', (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				resolve(result);
				connection.release(err => {
					if(err){
						next(err);
						logger.error("Error: " + err);
					}
				});
			}
		});
	});
});

//getPrev
const getPrevTactic = (req, next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
		'SELECT CONVERT(previous_name USING utf8) AS previous_name FROM (SELECT *, @prev AS previous_name, @prev := name ' +
			'FROM (SELECT DISTINCT(a.name), a.tactic_id FROM (SELECT t.* FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id WHERE ' +
			'(tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) a) b' +
			', (SELECT @prev:=NULL) vars ORDER BY name) subquery_alias ' +
			'WHERE name = ?', [req.params.tactic], (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				if(result[0]['previous_name'] != null){
					resolve(result);
					connection.release(err => {
						if(err){
							next(err);
							logger.error("Error: " + err);
						}
					});
				}else{
					connection.query(
						'SELECT DISTINCT(a.name) AS previous_name FROM (SELECT t.* FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id WHERE ' +
							'(tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) a ' +
							'ORDER BY name DESC LIMIT 1', (err, result) => {
						if(err){
							next(err);
							logger.error("Error: " + err);
						}else{
							resolve(result);
							connection.release(err => {
								if(err){
									next(err);
									logger.error("Error: " + err);
								}
							});
						}
					});
				}
			}
		});
	});
});

//getPrev
const getNextTactic = (req, next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
		'SELECT CONVERT(previous_name USING utf8) AS previous_name FROM (SELECT *, @prev AS previous_name, @prev := name ' +
			'FROM (SELECT DISTINCT(a.name), a.tactic_id FROM (SELECT t.* FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id WHERE ' +
			'(tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) a) b' +
			', (SELECT @prev:=NULL) vars ORDER BY name DESC) subquery_alias ' +
			'WHERE name = ?', [req.params.tactic], (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				if(result[0]['previous_name'] != null){
					resolve(result);
					connection.release(err => {
						if(err){
							next(err);
							logger.error("Error: " + err);
						}
					});
				}else{
					connection.query(
					'SELECT DISTINCT(a.name) AS previous_name FROM (SELECT t.* FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id WHERE ' +
						'(tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) a ' +
						'ORDER BY a.name LIMIT 1', (err, result) => {
						if(err){
							next(err);
							logger.error("Error: " + err);
						}else{
							resolve(result);
							connection.release(err => {
								if(err){
									next(err);
									logger.error("Error: " + err);
								}
							});
						}
					});
				}
			}
		});
	});
});

//tactics
const getTacticPage = (req, next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
		'SELECT a.*, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM (SELECT a.*, cc.link as "cc_link" FROM (SELECT t.*, tl.title, tl.ex_description, tl.link FROM tactics t LEFT JOIN tactic_links tl ' +
			'ON t.tactic_id = tl.tactic_id WHERE t.name = ? AND (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) a LEFT JOIN cc_license cc ON a.cc_license = cc.name ' +
			') a LEFT JOIN categories c ON ' +
			'a.category_submedium = c.category_id', [req.params.tactic], (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				resolve(result);
				connection.release(err => {
					if(err){
						next(err);
						logger.error("Error: " + err);
					}
				});
			}
		});
	});
});

//downloadDataset
const getDownloadDataset = (next) => new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
		if(err){
			next(err);
			logger.error("Error getting connection: " + err);
		}
		connection.query(
		'SELECT a.*, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM ' +
			'(SELECT t.*, tl.title, tl.link, tl.ex_description FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
			'WHERE (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL")) ' +
			'a LEFT JOIN categories c ON a.category_submedium = c.category_id', (err, result) => {
			if(err){
				next(err);
				logger.error("Error: " + err);
			}else{
				resolve(result);
				connection.release(err => {
					if(err){
						next(err);
						logger.error("Error: " + err);
					}
				});
			}
		});
	});
});

/****************************Endpoints***********************/
//home page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/templates/index.html');
});

//categories page
app.get('/categories', function(req, res) {
	res.sendFile(__dirname + '/templates/categories.html');
});

//tactics page
app.get('/tactics', function(req, res) {
	res.sendFile(__dirname + '/templates/tactics.html');
});

//downloads page
app.get('/downloads', function(req, res) {
	res.sendFile(__dirname + '/templates/downloads.html');
});

//get tactic examples for category page 
app.get('/categoryTactics', function(req, res, next) {
	res.on('finish', () => {
		logger.info("REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']);
	});
	getCategoryTactics(next).then(tactics => res.send(tactics)).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
});

//grab relevant site text (i.e. categories table text, downloads page text, home page text)
app.post('/siteText', function(req, res, next) {
	res.on('finish', () => {
		logger.info("REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']);
	});
	getSiteText(req, next).then(text => res.send(text)).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
})

//query tactic information for the 'list view' on categories page
app.get('/categoryList', function(req, res, next) {
	res.on('finish', () => {
		logger.info("REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']);
	});
	getCategoryList(next).then(categories => res.send(categories)).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
})

//query all relevant tactic information for display on tactic block page
app.get('/tacticsDB', function(req, res, next) {
	res.on('finish', () => {
		logger.info("REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']);
	});
	getTacticsDB(next).then(tactics => res.send(tactics)).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
});

//get previous tactic using alphabetical ordering
app.get('/getPrev/:tactic', function(req, res, next){
	getPrevTactic(req, next).then(tactics => res.send(tactics)).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
});

//get next tactic using alphabetical ordering
app.get('/getNext/:tactic', function(req, res, next){
	getNextTactic(req, next).then(tactics => res.send(tactics)).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
});

//query tactic specific information for display on tactic page
app.get('/tactics/:tactic', function(req, res, next){
	res.on('finish', () => {
		logger.info("REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']);
	});
	getTacticPage(req, next).then(tactics => {
		if(tactics[0] != null){
			res.render(__dirname + '/templates/tactic_page.html', {data: tactics});
		}else{
			res.render(__dirname + '/templates/tactic_page_not_found.html');
		}
	}).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
});

//query displayed tactic information, dump in excel, and download on client side
app.get('/downloadDataset', function(req, res, next) {
	res.on('finish', () => {
		logger.info("REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']);
	});
	getDownloadDataset(next).then(tactics => {
		const workbook = new exceljs.Workbook();
		workbook.creator = 'Nonviolence International';
		workbook.calcProperties.fullCalcOnLoad = true;
		workbook.properties.date1904 = true;
		const sheet = workbook.addWorksheet('My Sheet');
		sheet.columns = [
			{header: 'Tactic ID', key: 'id', width: 10},
			{header: 'Gene Sharp Number', key: 'sharp', width: 20},
			{header: 'Name', key: 'name', width: 35}, 
			{header: 'Description', key: 'desc', width: 40},
			{header: 'Categories', key: 'cats', width: 35},
			{header: 'Persuasive', key: 'persuasive', width: 10},
			{header: 'Coercive', key: 'coercive', width: 10},
			{header: 'First Use', key: 'first_use', width: 40},
			{header: 'Example Title', key: 'ex_title', width: 35},
			{header: 'Example Summary', key: 'ex_description', width: 35},
			{header: 'Example Link', key: 'ex_link', width: 20}
		];

		tactics.forEach((tactic) => {
			sheet.addRow({id: tactic['tactic_id'], name: tactic['name'], desc: tactic['description'], cats: tactic['categories'],
				sharp: tactic['gene_sharp_num'], persuasive: tactic['persuasive'], coercive: tactic['coercive'], first_use: tactic['first_use'], 
				ex_title: tactic['title'], ex_description: tactic['ex_description'], ex_link: tactic['link']});
		});


		sheet.eachRow({ includeEmpty: true }, function(row, rowNumber){
			row.eachCell(function(cell, colNumber){
				if (rowNumber == 1) {
					cell.font = {
						name: 'Arial',
						family: 2,
						bold: true,
			     		size: 10,
			     	}
			 	}else{
			 		cell.font = {
						name: 'Arial',
						family: 2,
						bold: false,
			     		size: 10,
			     	}
			 	}
			});
		});
		
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
		workbook.xlsx.write(res).then(function() {
			res.end()
		});
	}).catch(err => logger.error("ERR: " + err + " ////// REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']));
});

//download categories table picture 
app.get('/downloadCategoriesTable', function(req, res, next) {
	res.on('finish', () => {
		logger.info("REQ: " + req['url'] + " ////// RES: " + res['statusCode'] + " " + res['statusMessage']);
	});
	const r = fs.createReadStream(__dirname + '/static/site_pictures/NVI Nonviolent Tactic Categories Table.png');
	const ps = new stream.PassThrough();
	stream.pipeline(r, ps, (err) => {
   		if (err) {
   			next(err);
   			logger.error("Table download error " + err);
   			return res.sendStatus(400); 
    	}
  	});
  	ps.pipe(res);
});

//schedule weekly tactic picture pull from GGL drive
cron.schedule("0 0 * * 6", function() {
//cron.schedule("*/1 * * * *", function() { //for testing purposes
	syncFromDive();
}); 

process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});


process.on('SIGTERM', () => {
	console.info('SIGTERM received at ' + Date());
	console.log('Closing http server');
	server.close(() => {
		console.log('Http server closed');
		pool.end(function (err) {
	    	if (err){
				logger.error("app shutdown error: " + err);
		  	}
			console.log("DB connection ending");
			process.exit();
	    });
	});
});


process.on('SIGINT', () => {
	console.info('SIGINT received at ' + Date());
	console.log('Closing http server');
	server.close(() => {
		console.log('Http server closed');
		pool.end(function (err) {
	    	if (err){
				logger.error("app shutdown error: " + err);
		  	}
			console.log("DB connection ending");
			process.exit();
	    });
	});
});


process.on('uncaughtException', () => {
	console.info('Uncaught Exception at ' + Date());
	console.log('Closing http server');
	server.close(() => {
		console.log('Http server closed');
		pool.end(function (err) {
	    	if (err){
				logger.error("app shutdown error: " + err);
		  	}
			console.log("DB connection ending");
			process.exit();
	    });
	});
});


process.on('unhandledRejection', () => {
	console.info('Unhandled Rejection at ' + Date());
	console.log('Closing http server');
	server.close(() => {
		console.log('Http server closed');
		pool.end(function (err) {
	    	if (err){
				logger.error("app shutdown error: " + err);
		  	}
			console.log("DB connection ending");
			process.exit();
	    });
	});
});


