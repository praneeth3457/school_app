var bcrypt = require('bcrypt-nodejs');

var getUser = function(data, totalStudents, schoolId) {
    if(data.type === 'Student') {
        return studentUser(data, totalStudents, schoolId);
    } else if(data.type === 'Parent') {
        return parentUser(data, totalStudents, schoolId);
    } else if(data.type === 'Teacher') {
        return teacherUser(data, totalStudents, schoolId);
    } else if(data.type === 'Head') {
        return headUser(data, totalStudents, schoolId);
    } else if(data.type === 'Admin') {
        return adminUser(data, totalStudents, schoolId);
    }
};

var studentUser = function(data, totalStudents, schoolId) {
    var stId = 'ST' + schoolId + totalStudents;
    var stPassword = bcrypt.hashSync(data.stPassword, bcrypt.genSaltSync(11));

    return {
        id: stId,
        name: data.stName,
        username : data.stUsername,
        password : stPassword,
        presentClass : data.stPresentClass,
        presentSection : data.stPresentSection,
        classes : [{
            class : data.stClass,
            section : data.stSection,
            year : data.year
        }]
    };
};

var parentUser = function(data, totalStudents, schoolId) {
    var paId = 'PA' + schoolId + totalStudents;
    var paPassword = bcrypt.hashSync(data.paPassword, bcrypt.genSaltSync(11));
    return {
        id: paId,
        name: data.paName,
        username : data.paUsername,
        password : paPassword,
        students : [{
            id : data.stId,
            name : data.stName
        }]
    };
};

var teacherUser = function(data, totalStudents, schoolId) {
    var teId = 'TE' + schoolId + totalStudents;
    var tePassword = bcrypt.hashSync(data.tePassword, bcrypt.genSaltSync(11));

    return {
        id: teId,
        name: data.teName,
        username : data.teUsername,
        password : tePassword,
        classes : [{
            class : data.teClass,
            section : data.teSection,
            subject : data.teSubject,
            isClassTeacher : data.teIsClassTeacher
        }]
    };
};

var headUser = function(data, totalStudents, schoolId) {
    var heId = 'HE' + schoolId + totalStudents;
    var hePassword = bcrypt.hashSync(data.hePassword, bcrypt.genSaltSync(11));
    return {
        id: heId,
        name: data.heName,
        username : data.heUsername,
        password : hePassword
    };
};

var adminUser = function(data, totalStudents, schoolId) {
    var adId = 'AD' + schoolId + totalStudents;
    var adPassword = bcrypt.hashSync(data.adPassword, bcrypt.genSaltSync(11));
    return {
        id: adId,
        name: data.adName,
        username : data.adUsername,
        password : adPassword
    };
};

var comparePassword = function(password, dbPassword) {
    return bcrypt.compareSync(password, dbPassword);
};


module.exports = {
    getUser : getUser,
    studentUser : studentUser,
    parentUser : parentUser,
    teacherUser : teacherUser,
    headUser : headUser,
    adminUser : adminUser,
    comparePassword : comparePassword
};