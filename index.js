const express = require('express');
const { connect } = require('mongoose');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const router = require('./route/index');
const app = express();
const port = 3000;
const DB_URI = "mongodb+srv://anupambera882:anupambera882@anupam.vqwwh4s.mongodb.net/MyDB?retryWrites=true&w=majority";

// session store in db
const storeValue = new MongoDBStore({
    uri: DB_URI,
    collection: 'mySession'
})

// session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    name: "AuthenticationSession",
    secret: 'IamKey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    store: storeValue
}));

// local authentication
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    next();
});

router(app);
app.set('view engine', 'ejs');
app.set('views', './views');

(async () => {
    await connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("db is connected................");
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
})();