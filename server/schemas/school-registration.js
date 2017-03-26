var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var registrationSchema = new Schema({
    id: {type: String, unique: true},
    name: {type: String, required: true},
    branch : {type: String, required: true},
    address : {type: String, required: true},
    date : {type: String, default: Date.now},
    phone : [{
        phType : {type: String, required: true},
        phCode : {type: Number, required: true},
        phNumber : {type: Number, required: true}
    }],
    email: {type: String, required: true},
    logo: {type: String, required: true},
    bcImage: {type: String, required: true},
    users : {
        students : [{
            id : {type: String, index:{unique: true}},
            name : {type: String},
            username : {type: String, index:{unique: true}},
            password : {type: String},
             presentClass : {type: String}, 
            presentSection : {type: String},
            classes : [{ 
                class : {type: String},
                section : {type: String},
                year : {type: String}
            }]
        }],
        parents : [{
            id : {type: String, index:{unique: true}},
            name : {type: String},
            username : {type: String, index:{unique: true}},
            password : {type: String},
            students : [{ 
                id : {type: String},
                name : {type: String}
            }]
        }],
        teachers : [{
            id : {type: String, index:{unique: true}},
            name : {type: String},
            username : {type: String, index:{unique: true}},
            password : {type: String},
            classes : [{
                class : {type: String},
                section  : {type: String},
                subject : {type: String},
                isClassTeacher  : {type: Boolean}
            }]
        }],
        head : [{
            id : {type: String, index:{unique: true}},
            name : {type: String},
            username : {type: String, index:{unique: true}},
            password : {type: String}
        }],
        admin : [{
            id : {type: String, index:{unique: true}},
            name : {type: String},
            username : {type: String, index:{unique: true}},
            password : {type: String}
        }]
    }
});

// registrationSchema.pre('save', function(next) {
//    var user = this;
//    console.log(user);
//    if(user.users.students.length > 0){
//        if(user.users.students[0].password) {
//            this.hashPassword(user.users.students[0].password, function(err, hash){
//                if(err) {
//                    return next(err);
//                }
//
//                user.users.students[0].password = hash;
//                next();
//            });
//        }
//    }
//
//     if(user.users.parents.length > 0) {
//         if (user.users.parents[0].password) {
//             this.hashPassword(user.users.parents[0].password, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//
//                 user.users.parents[0].password = hash;
//                 next();
//             });
//         }
//     }
//
//     if(user.users.teachers.length > 0) {
//         if (user.users.teachers[0].password) {
//             this.hashPassword(user.users.teachers[0].password, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//
//                 user.users.teachers[0].password = hash;
//                 next();
//             });
//         }
//     }
//
//     if(user.users.head.length > 0) {
//         if (user.users.head[0].password) {
//             this.hashPassword(user.users.head[0].password, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//
//                 user.users.head[0].password = hash;
//                 next();
//             });
//         }
//     }
//
//     if(user.users.admin.length > 0) {
//         if (user.users.admin[0].password) {
//             this.hashPassword(user.users.admin[0].password, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//
//                 user.users.admin[0].password = hash;
//                 next();
//             });
//         }
//     }
// });

// registrationSchema.methods.hashPassword = function (userPassword, cb) {
//     bcrypt.genSalt(11, function(err, salt) {
//         if(err) {
//             return cb(err);
//         }
//         bcrypt.hash(userPassword, salt, null, function(err, hash) {
//             if(err) {
//                 return cb(err);
//             }
//
//             return cb(hash);
//
//         });
//     });
// };

module.exports =  mongoose.model('Registration', registrationSchema);