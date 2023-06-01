const { hash, compare } = require('bcrypt');
const userModel = require('../model/model');

class UserController {
    static getIndex = async (req, res) => {
        try {
            return res.render('home', {
                title: "Home"
            });
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static getCreateAccountIndex = async (req, res) => {
        try {
            return res.render('createAccount', {
                title: "Create Account"
            });
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static getLogin = async (req, res) => {
        try {
            return res.render('login', {
                title: "login"
            });
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static getUpdateProfile = async (req, res) => {
        try {
            const _id = req.session.user._id;
            const userData = await userModel.findById(_id);
            return res.render('updateProfile', {
                data: userData,
                title: "Update Profile"
            });
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static getForgotPasswordIndex = async (req, res) => {
        try {
            return res.render('forgotPassword', {
                title: "Forgot password"
            });
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static createNewAccount = async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;
            const checkUser = await userModel.findOne({ email });
            if (checkUser) {
                console.log("User already exist");
                return res.redirect("/login");
            }
            const hashPassword = await hash(password, 10);
            const newData = new userModel({
                name: name,
                email: email,
                phone: phone,
                password: hashPassword
            });

            await newData.save();
            console.log("User successfully create new account");
            return res.redirect("/");
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static UserLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            const userData = await userModel.findOne({ email });
            if (!userData) {
                console.log("User is not exist");
            }
            const comparePassword = await compare(password, userData.password);
            if (comparePassword) {
                console.log("User logged in successfully");
                // create session
                req.session.isLoggedIn = true;
                req.session.user = userData;
                req.session.save();
                return res.redirect("/");
            } else {
                console.log("wrong password entered");
                return res.redirect("/login");
            }
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static getUserDetailsById = async (req, res) => {
        try {
            const _id = req.session.user._id;
            const userData = await userModel.findById({ _id });
            return res.render('userProfile', {
                data: userData,
                title: "User Profile"
            })
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static changePassword = async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;
            const userData = await userModel.findOne({ email });
            if (!userData) {
                console.log("User is not exist");
            }
            // const comparePassword = await compare(password, userData.password);
            // if (!comparePassword) {
            //     console.log("Enter password is incorrect");
            //     return res.redirect("/");
            // }
            if (!password) {
                const password = await hash(password, 10);
            } else {
                password = userData.password;
            }
            await userModel.findByIdAndUpdate({ _id: userData._id },
                {
                    $set: {
                        name: name,
                        email: email,
                        phone: phone,
                        password: password
                    }
                },
                { new: true }
            );
            req.session.destroy();
            return res.redirect('/')
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static LogoutUserAccount = async (req, res) => {
        console.log("logout successfully");
        req.session.destroy();
        return res.redirect('/')
    }

    static deleteUserAccount = async (req, res) => {
        try {
            const _id = req.session.user._id;
            await userModel.findByIdAndDelete({ _id });
            req.session.destroy();
            return res.redirect('/');
        } catch (err) {
            return res.status(401).send(err);
        }
    }

    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const userData = await userModel.findOne({ email });
            if (!userData) {
                console.log("User is not exist");
                return res.redirect("/");
            }
            const newPassword = Math.floor(100000 + Math.random() * 900000);
            const hashPassword = await hash(newPassword, 10);
            await userModel.findByIdAndUpdate({ _id: userData._id },
                {
                    $set: {
                        password: hashPassword
                    }
                });
            return res.json({
                newPassword: newPassword
            })
        } catch (err) {

        }
    }
}




module.exports = UserController;