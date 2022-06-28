if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const helmet = require('helmet');
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const mongoSanitize = require('express-mongo-sanitize');

const ExpressError = require('./utils/expressError');

// Database Connection
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/apucp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log(`Database Connected: ${dbUrl}`);
});

// Content Security Policy (CSP) Configuration
const connectSrcUrls = [
    `https://graph.facebook.com/v14.0/${process.env.FB_PAGE_ID}/feed`,
    `https://graph.facebook.com/v14.0/${process.env.FB_PAGE_ID}/photos`
]
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://connect.facebook.net/en_US/sdk.js",
    "https://app.termly.io/embed.min.js"
];
const styleSrcUrls = [
    "https://cdnjs.cloudflare.com",
];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com",
];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrcElem: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://www.facebook.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    },
}));
app.use(session({
    secret: process.env.SECRET || 'devSecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbUrl }),
    cookie: {
        name: 'session',
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use((req, res, next) => {
    res.locals.siteTitle = 'APUCP (V4)';
    res.locals.currentYear = new Date().getFullYear();
    res.locals.currentAdmin = req.session.admin_id;
    res.locals.tempConfession = req.session.tempConfession;
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route
app.use('/confessions', require('./routes/confessions'));
app.use('/blacklistWord', require('./routes/blacklistWord'));
app.use('/apucp-admin', require('./routes/admin'));
app.use('/', require('./routes/pages'));

// Error Handler
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "SOMETHING WENT WRONG.";
    }
    console.log(err)
    res.status(statusCode).render("error", { err });
});

// Setup server
const port = process.env.PORT || 3000;
/* HTTP */
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

/* HTTPS */
// const fs = require("fs");
// const https = require("https");
// https
//     .createServer(
//         {
//             key: fs.readFileSync("server.key"),
//             cert: fs.readFileSync("server.cert"),
//         }, app)
//     .listen(port, function () {
//         console.log(`Listening on port: ${port}`);
//     });

