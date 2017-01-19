var express = require('express');
var app = express();

app.set('port',(process.env.PORT || 3000));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/src/'));
app.use(express.static(__dirname + '/dist/'));
app.use(express.static(__dirname + '/dist/app/'));

app.get('/', function(req,res){
  res.render(__dirname + '/src/nodeJSindex.html');
});

app.listen(app.get('port'), function(){
  console.log('server is now up on the process.env.PORT or port 3000');
});

