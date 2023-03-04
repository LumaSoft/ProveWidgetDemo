const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const hbsRouter = require('./routes/index');
const helpers = require('./lib/util');
const db = require('./config/db.js');


const PORT = process.env.PORT || 3000;

db.initFirebase();

// Express app config
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});
//Configure session middleware
app.use(session({
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 10
    }
}));

// Create `ExpressHandlebars` instance with a default layout.
const hbs = create({
    //helpers,
    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    helpers,
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
        path.join(__dirname, 'views/partials/auth'),
        path.join(__dirname, 'views/partials/page-components'),
        path.join(__dirname, 'views/partials/datatables'),
    ],
});


// view engine setup
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.static(path.resolve(__dirname, "./assets")));


app.use(hbsRouter);


app.use((err, req, res, next) => {
    console.log("err", err);
    res.render('404', { pageTitle: "Page Not Found" });
});



// error handler middleware
app.use((err, req, res, next) => {
    if (process.env.ERROR_TO_CONSOLE) {
        console.error(err);
    }
    if (err?.response?.data?.message) {
        //@ts-ignore
        err.message = err.response.data.message;
    } else {
        err.message = err.message || "";
    }
    if (err.data != null) {
        return res.status(err.status || 400).json({ "message": err.message, "data": err.data });
    } else return res.status(err.status || 400).json({ "message": err.message });
});

const start = async () => {
    app.listen(PORT, async () => {
        console.log(`API running on http://127.0.0.1:${PORT}`);
    });
};

start();