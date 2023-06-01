const multer = require('multer');
const path = require('path');
const adminModel = require("../Model/adminModel");

function isLogin(req, res, next) {
    if (!req.session.isLoggedIn) {
        console.log("you are not login");
        return res.redirect('/Admin-login');
    }
    next();
}

function isLogout(req, res, next) {
    if (req.session.isLoggedIn) {
        console.log("you are already login");
        return res.redirect('/');
    }
    next();
}

function checkLogin(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    adminModel.findById(req.session.user._id)
        .then((userVal) => {
            req.user = userVal;
            next();
        }).catch((err) => {
            console.log("user not found");
        });
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../public/userImages'));
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
}).single("image");


module.exports = { checkLogin, isLogin, isLogout, upload };