var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');
var app = express();
var PORT = process.env.PORT || 3000;
var jwt = require('jwt-simple');
var passport = require('passport');
var mongoose = require('./config/lib/mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(function(err, status) {
    if(err) {
        console.log(err + '-' + status);
    }else{
        console.log('Connected to the database = ' + status);
    }
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
//app.use(session({secret:"udj9sd8un8d678aaf76", resave:false, saveUninitialized:true}));

/*
* APIs for the School Application
 */
var schoolAdmin = require('./server/routes/school-app-admin')(app, express);
var school = require('./server/routes/school-registration')(app, express);
var user = require('./server/routes/user-registration')(app, express);
app.use('/schoolAppAdmin', schoolAdmin);
app.use('/schools', school);
app.use('/users', user);




app.use(express.static(__dirname + '/public'));

app.listen(PORT, function(err){
    if(err){
        console.log('Error in server!');
    }else{
        console.log('Server running on port: 3000');
    }
});