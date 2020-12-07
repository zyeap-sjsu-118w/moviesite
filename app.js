const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
var conn = require('./config')
var url = require('url')
var bodyParser=require('body-parser')
var path = require('path')

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("images", express.static(__dirname + "images"));
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/index.html')
});

app.post('/contact', function(req, res){
	conn.query("INSERT INTO emailupdates(email) VALUES (?);", [req.body.email], function(error, results, fields){
		if(error){
			console.log(error);
			res.json({
				success: false
			});
		} else {
			res.json({
				success: true
			})
		}
	});

});

app.post('/register', function(req, res){
	conn.query("INSERT INTO users(email, username, password) VALUES (?, ?, ?);", [req.body.email, req.body.username, req.body.password], function(error, results, fields){
		if(error){
			console.log(error);
			res.json({
				success: false
			});
		} else {
			res.json({
				success: true
			})
		}
	});

});

app.post('/login', function(req, res){
	conn.query("SELECT * FROM users WHERE email=?", req.body.email, function(error, results, fields){
		var body = req.body;
		var success = null;
		var message = "";
		if(error){
			success = false;
			message = "Unknown error occured"
		} else {
			if(results.length > 0){
				if(results[0]['username'] == req.body.username){
					if(results[0]['password'] == req.body.password){
						success = true;		
						message = "success";
					} else {
						success = false;	
						message = "PASSWORD incorrect";	
					}
				} else {
					success = false;		
					message = "USERNAME incorrect";	
				}
			} else {
				success = false;				
				message = "EMAIL incorrect";
			}
			
		}
	res.json({
				success: success,
				message: message
			});
	})

})

app.use('/viewer', (req, res) => {
    fs.readFile('public/viewerpage.html', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        
        conn.query("SELECT * FROM MovieViewer WHERE MovieName=?", req.query.title, function(error, results, fields){
            let str = data.toString().replace('{{title}}', results[0]['fullTitle'])
            .replace('{{synopsis}}', results[0]['Synopsis'])
            .replace('{{amazon}}', results[0]['AmazonPurchase']) //amazon
            .replace('{{tomato}}', results[0]['TomatoURL'])//rt
            .replace('{{apple}}', results[0]['ApplePurchase'])//apple
            .replace('{{google}}', results[0]['GooglePurchase'])//google
            .replace('{{trailer}}', results[0]['trailerEmbed']);//youtube
            
            res.write(str)
            res.end();
        })
    })
});

app.listen(port, () => {
  console.log(`site listening at http://localhost:${port}`)
});