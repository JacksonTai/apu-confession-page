const express = require('express')
const app = express()
const path = require('path')
const mongoose = require("mongoose");
const session = require('express-session')
const methodOverride = require("method-override");
const session = require('express-session')

const ExpressError = require('./utils/expressError')

// Database Connection
const dbUrl = 'mongodb://localhost:27017/apucp';
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Database connected: ${dbUrl} `);
}).catch((e) => {
    console.log(e);
});

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session({
    secret: "~MWVsAg5mHfKAYw]",
    resave: false,
    saveUninitialized: false,
}));
app.use((req, res, next) => {
    res.locals.siteTitle = 'APUCP (V4)'
    res.locals.currentYear = new Date().getFullYear();
    res.locals.currentAdmin = req.session.admin_id;
    next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Route
app.use('/confessions', require('./routes/confessions'));
app.use('/blacklist', require('./routes/blacklist'));
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
    res.status(statusCode).render("error", { err });
});

// Setup server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})