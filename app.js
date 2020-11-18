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

const pinoms = require('pino-multi-stream');
var prettyStream = pinoms.prettyStream();
var streams = [
  {level: 'error', stream: fs.createWriteStream('./logs/error.log', {flags: 'a'})},
  {level: 'info', stream: fs.createWriteStream('./logs/files.log', {flags: 'a'})},
  {stream: prettyStream }
]
var logger = pinoms(pinoms.multistream(streams));
const key = require('./nvi-tactics-test-d4263bf06b32.json');

/*****************************Define Variables***************************/
const hostname = '0.0.0.0';
//const hostname = '127.0.0.1';
//const port = 3000;
const port = 8000;
__dirname = '/home/dh_fpsyj8/tacticstest.nonviolenceinternational.net';
//__dirname = '/Users/scotttheer/Documents/GitHub/NVITacticsDB';

/*****************************Helper Functions***************************/
function queryTacticsData() {
	const query = new Promise((resolve, reject) => {
		connection.query(
			'SELECT name FROM tactics',
	      	(err, result) => {
	    		if(err){
	    			reject(err);
	    		}else{
	    			resolve(result);
	    		}
	    	}
	    );
	}).catch(alert);
	return query;
}

/****************************Manage DB Connection***********************/
var connection = mysql.createConnection({
	host: '208.97.163.43',
	user: 'michaelbeer',
	password: 'Gr33npen',
	database: 'nvi_tactics'
});

connection.connect(function(err){
	if (err) throw err;
});

/****************************Create/Manage Server***********************/
var app = express();
var server = app.listen(port, hostname, function() {
	console.log('Listening');
});
app.use('/static', express.static('static'));
app.use('/static/tactic_pictures/', express.static('static'));
app.set('views', './templates');
app.use(bodyParser.json());

nunjucks.configure('templates/', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
	logger.info(console.log(JSON.stringify(req.headers)));
	res.sendFile(__dirname + '/templates/index.html');
});

app.get('/categories', function(req, res) {
	res.sendFile(__dirname + '/templates/categories.html');
});

app.get('/categoryTactics', function(req, res) {
	connection.query(
		'SELECT a.name, a.persuasive, a.coercive, c.parent_categories FROM (SELECT t.* FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
			'WHERE (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL") AND (t.picture IS NOT NULL AND t.picture != "NULL")) a LEFT JOIN categories c ' +
			'ON a.category_submedium = c.category_id', (err, result) => {
		if(err){
			logger.error("Error: " + err);
		}else{
			res.send(result);
		}
	});
});

app.post('/siteText', function(req, res) {
	connection.query(
		'SELECT text FROM site_text WHERE page = ? AND section = ?', [req.body['value'][0], req.body['value'][1]], (err, result) => {
		if(err){
			logger.error("Error: " + err);
		}else{
			res.send(result);
		}
	});
})

app.get('/categoryList', function(req, res) {
	connection.query(
		'SELECT DISTINCT(a.name), a.tactic_id, a.picture, a.summary, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM ' + 
			'(SELECT t.name, t.tactic_id, t.picture, t.summary, t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id) a LEFT JOIN categories c ' +
			'ON a.category_submedium = c.category_id', (err, result) => {
		if(err){
			logger.error("Error: " + err);
		}else{
			res.send(result);
		}		
	});
})

app.get('/tactics', function(req, res) {
	res.sendFile(__dirname + '/templates/tactics.html');
});

app.get('/tacticsDB', function(req, res) {
	connection.query(
		'SELECT DISTINCT(a.name), a.tactic_id, a.picture, a.summary, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM ' + 
			'(SELECT t.name, t.tactic_id, t.picture, t.summary, t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
			'WHERE (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL") AND (t.picture IS NOT NULL AND t.picture != "NULL")) a LEFT JOIN categories c ' +
			'ON a.category_submedium = c.category_id', (err, result) => {
		if(err){
			logger.error("Error: " + err);
		}else{
			res.send(result);
		}
	});
});

app.get('/tactics/:tactic', function(req, res){
	connection.query(
		'SELECT a.*, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM (SELECT t.*, tl.title, tl.ex_description, tl.link FROM tactics t LEFT JOIN tactic_links tl ' +
			'ON t.tactic_id = tl.tactic_id WHERE t.name = ? AND (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL") AND ' +
			'(t.picture IS NOT NULL AND t.picture != "NULL")) a LEFT JOIN categories c ON ' +
			'a.category_submedium = c.category_id', [req.params.tactic], (err, result) => {
		if(err){
			logger.error("Error: " + err);
		}else{
			if(result[0] != null){
				res.render(__dirname + '/templates/tactic_page.html', {data: result[0]});
			}else{
				res.render(__dirname + '/templates/tactic_page_not_found.html');
			}
		}
	});
});

app.get('/downloadables', function(req, res) {
	res.sendFile(__dirname + '/templates/downloadables.html');
});

app.get('/downloadDataset', function(req, res) {
	connection.query(
		'SELECT a.*, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM ' +
			'(SELECT t.*, tl.title, tl.link, tl.ex_description FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
			'WHERE (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL") AND (t.picture IS NOT NULL AND t.picture != "NULL")) ' +
			'a LEFT JOIN categories c ON a.category_submedium = c.category_id', (err, result) => {
		if(err){
			logger.error("Error: " + err);
		}else{
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

			result.forEach((tactic) => {
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
		}
	});
});


app.get('/downloadCategoriesTable', function(req, res) {
	res.send(__dirname + '/static/table.png');
});

function syncFromDive(){
	const SCOPES = ['https://www.googleapis.com/auth/drive'];

	authorize(null, downloadPictures);

    function authorize(credentials, callback) {
        const scopes = 'https://www.googleapis.com/auth/drive';
        const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)

        jwt.authorize((err, response) => {
            if (err) logger.error("Error: " + err);
            if (response) callback(jwt);
        })
    }

    function downloadPictures(jwt){
    	const drive = google.drive({version: 'v3', 
    		auth: jwt,
    		params: {
			    key: 'AIzaSyBwx5rab6qN3AXOXb63jzgfucm0--7PSJQ'
			}});
    	drive.files.list({
    		auth: jwt,
    		corpora: 'drive',
			supportsAllDrives: true,
			includeItemsFromAllDrives: true,
			driveId: '0AF0hsatILwu6Uk9PVA',
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
    			//await getPictures(drive, jwt, file.id, dest).catch(console.error);
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

cron.schedule("0 0 * * 6", function() {
//cron.schedule("*/3 * * * *", function() {
	syncFromDive();
});



