/******************************Load Packages*****************************/
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var exceljs = require('exceljs');
var fs = require('fs');
var saveAs = require('file-saver');

/*****************************Define Variables***************************/
const hostname = '0.0.0.0';
const port = 8000;
__dirname = '/home/dh_fpsyj8/tacticstest.nonviolenceinternational.net';

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
	console.log("Connected!");
});

/****************************Create/Manage Server***********************/
var app = express();
var server = app.listen(port, hostname, function() {
	console.log('Listening on 3000!');
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
			console.log(err);
		}else{
			res.send(result);
		}
	});
});

app.post('/siteText', function(req, res) {
	connection.query(
		'SELECT text FROM site_text WHERE page = ? AND section = ?', [req.body['value'][0], req.body['value'][1]], (err, result) => {
		if(err){
			console.log(err);
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
			console.log(err);
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
		'SELECT a.name, a.tactic_id, a.picture, a.summary, CONCAT(c.category_name, "; ", c.parent_categories) AS categories FROM ' + 
			'(SELECT t.name, t.tactic_id, t.picture, t.summary, t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
			'WHERE (tl.ex_description IS NOT NULL AND tl.ex_description != "NULL") AND (t.picture IS NOT NULL AND t.picture != "NULL")) a LEFT JOIN categories c ' +
			'ON a.category_submedium = c.category_id', (err, result) => {
		if(err){
			console.log(err);
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
			console.log(err);
		}else{
			console.log(result[0]);
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
			console.log(err);
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


