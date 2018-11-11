/*var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
*/

var express = require("express");
var app     = express();
var path    = require("path");
var pdf     = require('html-pdf');
var ejs     = require('ejs');
var fs      = require('fs');
var path    = require('path');
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

var routes  = require('./routes/routes');
var db = require('./db');
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/', routes);

function currentTime()
{
  var d = new Date();
  return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

}

io.on('connection', function(socket){
  //console.log('connected?')
  socket.on('pdf_Report_Sharing', function(pdfName){
      // hard-coded value to be removed
      //var d = new Date();
      io.emit('pdf_Report_Sharing', '<ul class="list-group">');
      io.emit('pdf_Report_Sharing', emitMessage('New file is being created.'));
     var mysql = require('mysql')
     var connection = mysql.createConnection({
     host     : 'ec2-35-178-213-196.eu-west-2.compute.amazonaws.com',
     user     : 'TestUser',
     password : 'PassWord',
     database : 'ninja_assignment2'
     });

     var user_id = pdfName;
   
     var connectionQuery = 'SELECT * from tblEmployee WHERE EmpID =' + user_id;
     connection.connect(function(err) {
      io.emit('pdf_Report_Sharing', emitMessage('DB connected.'));
      connection.query(connectionQuery, function(err, result) {
             if(err){
                 throw err;
             } else {
                 var obj = {};
                 obj = {empData: result};
                 ejs.renderFile(__dirname + '/views/exportReport.ejs', obj, function(err, result) {
                  io.emit('pdf_Report_Sharing', emitMessage('PDF Data collected from databae.'));
                  // render on success
                     if (result) {
                      html = result;
                         var pdfFileName = 'pdf/empReport'+user_id+'.pdf';
                         var options = {
                             filename: pdfFileName,
                             format: 'A4',
                             orientation: 'portrait',
                             directory: './pdf/',
                             type: "pdf"
                           };
                           pdf.create(html,options).toFile(function(err, resPDF) {
                            if (err)
                              io.emit('pdf_Report_Sharing', emitMessage('Error while creating PDF: ' + err));
                            else
                              io.emit('pdf_Report_Sharing', emitMessage('<a href="/' + pdfFileName + '" target="new">' + pdfFileName + '</a> is now ready to download.'));
                             });
                           }
                     // render or error
                     else {
                      io.emit('pdf_Report_Sharing', emitMessage('An error occurred'));
                      res.end('An error occurred');
                     }
                 });
             }
         });
     })
     io.emit('pdf_Report_Sharing', '</ul>');
  });
});

function emitMessage(msg)
{
  return '<li class="list-group-item">' + currentTime() + ' - ' + msg + '</li>'
}


server.listen(port, function(){
  console.log('listening on *:' + port);
});
