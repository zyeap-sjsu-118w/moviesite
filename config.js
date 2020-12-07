var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '35.202.185.150',
  user     : 'zachariah.yeap_sjsu.edu',				
  password : 'bus118w2020',		
  port     : '65141',			
  database : 'movie_site'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error while connecting with database.\n", err);
}
});

module.exports = connection;