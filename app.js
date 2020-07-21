/******************************Load Packages*****************************/
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');

/*****************************Define Variables***************************/
const hostname = '127.0.0.1';
const port = 3000;
__dirname = '/Users/scotttheer/Documents/GitHub/NVITacticsDB';

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
	host: 'localhost',
	user: 'root',
	password: 'Uncharted96',
	database: 'tactics_new'
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
		'WITH RECURSIVE tactic_grouping (category_id, category_name, parent_id, id, n) AS ' +
			'(SELECT category_id, category_name, parent_id, category_id AS id, 1 AS n FROM categories WHERE category_id IN ' +
				'(SELECT t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
				'WHERE tl.ex_description IS NOT NULL AND t.picture IS NOT NULL) ' +
    		'UNION ALL ' +
    		'SELECT c.category_id, c.category_name, c.parent_id, tg.id, n+1 FROM tactic_grouping tg ' +
    		'JOIN categories c ON c.category_id = tg.parent_id) ' +
    		'SELECT * FROM (SELECT t.name, t.tactic_id, tg.category_name, t.coercive, t.persuasive FROM tactic_grouping tg ' +
    		'LEFT JOIN tactics t ON tg.id = t.category_submedium WHERE category_name LIKE "Acts of%" ' +
    		'AND t.picture IS NOT NULL) a LEFT JOIN tactic_links tl on a.tactic_id = tl.tactic_id WHERE tl.ex_description IS NOT NULL', (err, result) => {
		if(err){
			console.log(err);
		}else{
			res.send(result);
		}
	});
});

app.post('/categoryText', function(req, res) {
	connection.query(
		'SELECT text FROM categories_text WHERE page = ?', [req.body['value']], (err, result) => {
		if(err){
			console.log(err);
		}else{
			res.send(result);
		}
	});
})

app.get('/categoryList', function(req, res) {
	connection.query(
		'WITH RECURSIVE tactic_grouping (category_id, category_name, parent_id, id, n) AS ' +
			'(SELECT category_id, category_name, parent_id, category_id AS id, 1 AS n FROM categories WHERE category_id IN ' +
			'(SELECT t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id) ' +
			'UNION ALL ' +
			'SELECT c.category_id, c.category_name, c.parent_id, tg.id, n+1 FROM tactic_grouping tg ' +
			'JOIN categories c ON c.category_id = tg.parent_id) ' +
			'SELECT f.* FROM (SELECT t.name, t.tactic_id, t.picture, t.summary, GROUP_CONCAT(tg.category_name SEPARATOR "; ") AS categories, GROUP_CONCAT(tg.n SEPARATOR "; ") AS level ' +
			'FROM tactic_grouping tg LEFT JOIN tactics t ON tg.id = t.category_submedium WHERE t.name like "%" group by t.name) f', (err, result) => {
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
		'WITH RECURSIVE tactic_grouping (category_id, category_name, parent_id, id, n) AS ' +
			'(SELECT category_id, category_name, parent_id, category_id AS id, 1 AS n FROM categories WHERE category_id IN ' +
				'(SELECT t.category_submedium FROM tactics t LEFT JOIN tactic_links tl ON t.tactic_id = tl.tactic_id ' +
				'WHERE tl.ex_description IS NOT NULL AND t.picture IS NOT NULL) ' +
    		'UNION ALL ' +
    		'SELECT c.category_id, c.category_name, c.parent_id, tg.id, n+1 FROM tactic_grouping tg ' +
    		'JOIN categories c ON c.category_id = tg.parent_id) ' +
    		'SELECT f.* FROM (SELECT t.name, t.tactic_id, t.picture, t.summary, GROUP_CONCAT(tg.category_name SEPARATOR "; ") AS categories, GROUP_CONCAT(tg.n SEPARATOR "; ") AS level ' +
    		'FROM tactic_grouping tg LEFT JOIN tactics t ON tg.id = t.category_submedium WHERE t.summary IS NOT NULL AND t.picture IS NOT NULL group by t.name) f '+
    		'LEFT JOIN tactic_links tl ON f.tactic_id = tl.tactic_id WHERE tl.ex_description IS NOT NULL', (err, result) => {
		if(err){
			console.log(err);
		}else{
			res.send(result);
		}
	});
});

app.get('/tactics/:tactic', function(req, res){
	connection.query(
		'WITH RECURSIVE tactic_grouping (category_id, category_name, parent_id, id, n) AS ' +
			'(SELECT category_id, category_name, parent_id, category_id AS id, 1 AS n FROM categories WHERE category_id IN ' +
				'(SELECT category_submedium FROM tactics WHERE name = ?) ' +
    		'UNION ALL ' +
    		'SELECT c.category_id, c.category_name, c.parent_id, tg.id, n+1 FROM tactic_grouping tg ' +
    		'JOIN categories c ON c.category_id = tg.parent_id) ' +
    		'SELECT * FROM (SELECT t.*, GROUP_CONCAT(tg.category_name SEPARATOR "; ") AS categories ' +
    		'FROM tactic_grouping tg LEFT JOIN tactics t ON tg.id = t.category_submedium WHERE t.name = ?) f '+
    		'LEFT JOIN tactic_links tl ON f.tactic_id = tl.tactic_id WHERE tl.ex_description IS NOT NULL', [req.params.tactic, req.params.tactic], (err, result) => {
		if(err){
			console.log(err);
		}else{
			if(result[0] != null){
				res.render(__dirname + '/templates/tactic_page.html', {data: result[0]});
			}else{
				res.render(__dirname + '/templates/tactic_page_not_found.html');
			}
		}
	});
});


