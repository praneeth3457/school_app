var School = require('../schemas/school-registration');
var UserSchema = require('../services/getUserSchema');
var User = require('../schemas/school-app-admin');
var config = require('./../../config/database/default');
var jwt = require('jwt-simple');
var passport = require('passport');

module.exports = function(app, express) {

    var api = express.Router();
    var isUser = false;
    api.post('/registration',
        function(req, res, next) {
            var headers = req.headers;
            if(headers && headers.authorization) {
                var auth = req.headers.authorization;
                var authSplit = auth.split(' ');
                if (authSplit[1]) {
                    var token = authSplit[1];
                    var decoded = jwt.decode(token, config.secretKey);
                    User.findOne({username: decoded.username}, function (err, user) {
                        if (user) {
                            isUser = true
                        }
                        next();
                    });

                    School.findOne({users : {admin : decoded.adUsername}}, function (err, adUser){
                        if (adUser) {
                            isUser = true
                        }
                        next();
                    });
                } else {
                    return res.status(403).send({success : false, msg : 'Invalid token', error : 'token error'});
                }
            } else {
                return res.status(403).send({success : false, msg : 'Required token', error : 'token error'});
            }
        },
        function(req, res, next) {
            if(isUser) {
                School.findOne({id : req.body.sId}, function(err, data){
                    if(data) {
                        var len = 0;
                        if(req.body.type === 'Student') {

                            if(data.users.students) {
                                len = data.users.students.length;
                            }

                            School.findByIdAndUpdate({_id : data._id},
                                {$push: {'users.students': UserSchema.getUser(req.body, len, req.body.sId)}},
                                {safe: true, upsert: true},
                                function(err, res){
                                    if(err) {
                                        //return res.status(403).send({success : false, msg : 'Invalid student', error : 'student error'});
                                    }
                                    next();
                                    //res.status(200).send({success : true, msg : 'Successfully student registered.', data : res});
                                }
                            );
                        } else if(req.body.type === 'Parent') {
                            if(data.users.parents.length) {
                                len = data.users.parents.length;
                            }
                            School.findByIdAndUpdate({_id : data._id},
                                {$push: {'users.parents': UserSchema.getUser(req.body, len, req.body.sId)}},
                                {safe: true, upsert: true},
                                function(err, res){
                                    if(err) {
                                       // return res.status(403).send({success : false, msg : 'Invalid parent', error : 'parent error'});
                                    }
                                    next();
                                    //res.status(200).send({success : true, msg : 'Successfully parent registered.', data : res});
                                }
                            );
                        } else if(req.body.type === 'Teacher') {
                            if(data.users.teachers.length) {
                                len = data.users.teachers.length;
                            }
                            School.findByIdAndUpdate({_id : data._id},
                                {$push: {'users.teachers': UserSchema.getUser(req.body, len, req.body.sId)}},
                                {safe: true, upsert: true},
                                function(err, res){
                                    if(err) {
                                        //return res.status(403).send({success : false, msg : 'Invalid teacher', error : 'teacher error'});
                                    }
                                    next();
                                    //res.status(200).send({success : true, msg : 'Successfully teacher registered.', data : res});
                                }
                            );
                        } else if(req.body.type === 'Head'){
                            if(data.users.head.length) {
                                len = data.users.head.length;
                            }
                            School.findByIdAndUpdate({_id : data._id},
                                {$push: {'users.head': UserSchema.getUser(req.body, len, req.body.sId)}},
                                {safe: true, upsert: true},
                                function(err, res){
                                    if(err) {
                                        //return res.status(403).send({success : false, msg : 'Invalid head', error : 'head error'});
                                    }
                                    next();
                                    //res.status(200).send({success : true, msg : 'Successfully head registered.', data : res});
                                }
                            );
                        } else if(req.body.type === 'Admin'){
                            if(data.users.admin.length) {
                                len = data.users.admin.length;
                            }
                            School.findByIdAndUpdate({_id : data._id},
                                {$push: {'users.admin': UserSchema.getUser(req.body, len, req.body.sId)}},
                                {safe: true, upsert: true},
                                function(err, res){
                                    if(err) {
                                        // return res.status(403).send({success : false, msg : 'Invalid admin', error : 'admin error'});
                                    }
                                    next();
                                }
                            );
                        }

                        data.save(function(err) {
                            if(err) {
                                console.log('error');
                                res.send({message: 'Unsuccess', error:err});
                                return;
                            }
                            console.log('success');
                            res.status(200).send({success : true, msg : 'Successfully registered.', data : 'success'});
                        });

                    } else {
                        res.send('error');
                    }

                    if(err) {
                        res.send(err);
                    }

                });
            } else {
                return res.status(403).send({success : false, msg : 'Invalid token', error : 'token error'});
            }
        }
    );


    return api

};