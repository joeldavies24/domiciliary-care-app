const express = require("express");
const app = express();
const port = 3000;
const passport = require('passport');
const Carer = require("./models/user.js");
const Visit = require("./models/visit");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', [__dirname + "/views", __dirname + "/views/user"]);

const session = require("express-session");
app.use(
    session({
        secret: "randomisedtext",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || req.session.user || null;
    next();
});

passport.use(Carer.createStrategy());
passport.serializeUser(Carer.serializeUser());
passport.deserializeUser(Carer.deserializeUser());

require("./routes.js")(app);

const mongoose = require("./config/dbconfig.js");
const db = mongoose.connection;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

module.exports = app;