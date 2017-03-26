var Admin = require('../schemas/school-app-admin');
var UserSchema = require('../services/getUserSchema');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('./../../config/database/default');

module.exports = function(app, express) {

    var api = express.Router();

    api.post('/registration', function(req, res) {

        Admin.find({}, function(err, data){

            if(data) {
                var length = data.length;
                var isUser = false;
                for(var i=0; i<length; i++) {
                    if(data[i].username == req.body.username) {
                        isUser = true;
                    }
                }

                if(!isUser) {
                    var len = length + 1;
                    var admin = new Admin({
                        id : 'ADMIN' + len,
                        name : req.body.name,
                        username : req.body.username,
                        password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(11))
                    });

                    admin.save(function(err) {
                        if(err) {
                            res.status(403).send({success : false, msg : 'Unable to register.', error : err});
                            return;
                        }

                        res.status(200).send({success : true, msg : 'Successfully registered.', data : admin});
                    });
                } else {
                    res.status(403).send({success : false, msg : 'Username already exist.', error : 'error'});
                }

            }
            if(err) {
                res.status(403).send({success : false, msg : 'Unable to register.', error : err});
            }

        });

    });

    api.post('/authenticate', function(req, res) {
        Admin.findOne({username : req.body.username}, function(err, data){
            if(data) {
                var isPassword = UserSchema.comparePassword(req.body.password, data.password);
                if(isPassword) {
                    var token = jwt.encode(data,config.secretKey);
                    res.status(200).send({success : true, msg : 'Successfully logged in.', data : data, token : 'JWT ' + token});
                } else {
                    res.status(403).send({success : false, msg : 'Password not correct', error : 'error'});
                }
                res.send(isPassword);
            } else {
                res.status(403).send({success : false, msg : 'Username not correct', error : 'error'});
            }
             if(err) {
                 res.status(403).send({success : false, msg : 'Unable to login.', error : err});
             }
        });
    });


    return api

};