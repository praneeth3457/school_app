var School = require('../schemas/school-registration');
var config = require('./../../config/database/default');
var User = require('../schemas/school-app-admin');
var jwt = require('jwt-simple');
var passport = require('passport');

module.exports = function(app, express) {

    var api = express.Router();

    api.post('/registration', function(req, res) {
        School.find(function(err, data){
            var sid;
            var generatedSId;
            var isSchool = false;
            if(data.length > 0) {
                sid = 10000 + data.length + 1;
                generatedSId = 'S' + sid;
                for(var i=0; i<data.length; i++){
                    if(data.name === req.body.scName && data.branch === req.body.scBranch) {
                        isSchool = true;
                    }
                }
            } else {
                generatedSId = 'S10001';
            }

            if(!isSchool) {
                var headers = req.headers;
                if(headers && headers.authorization) {
                    var auth = req.headers.authorization;
                    var authSplit = auth.split(' ');

                    if(authSplit[1]) {
                        var token = authSplit[1];
                        var decoded = jwt.decode(token, config.secretKey);
                        User.findOne({username: decoded.username}, function (err, user) {
                            if (user) {
                                var school = new School({
                                    id: generatedSId,
                                    name: req.body.scName,
                                    branch: req.body.scBranch,
                                    address: req.body.scAddress,
                                    phone: [{
                                        phType: req.body.scPhType,
                                        phCode: req.body.scPhCode,
                                        phNumber: req.body.scPhNumber
                                    }],
                                    email: req.body.scEmail,
                                    logo: req.body.scLogo,
                                    bcImage: req.body.scBcImage,
                                    users: {
                                        students: [],
                                        parents: [],
                                        teachers: [],
                                        head: [],
                                        admin: []
                                    }
                                });

                                school.save(function (err) {
                                    if (err) {
                                        return res.status(403).send({
                                            success: false,
                                            msg: 'Unable to register.',
                                            error: err
                                        });
                                    }

                                    res.status(200).send({
                                        success: true,
                                        msg: 'School successfully registered.',
                                        data: 'success'
                                    });
                                });
                            } else {

                                return res.status(403).send({
                                    success: false,
                                    msg: 'Invalid token',
                                    error: 'token error'
                                });
                            }
                        });
                    } else {

                        return res.status(403).send({success : false, msg : 'Invalid token', error : 'token error'});
                    }
                } else {

                    return res.status(403).send({success : false, msg : 'Required token', error : 'token error'});
                }

            } else {

                return res.status(403).send({success : false, msg : 'School aleady registered.', error : 'error'});
            }

        });

    });


    return api

};