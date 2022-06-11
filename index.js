const express = require('express')
const app = express()
const path = require('path')
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require('express-session')

const ExpressError = require('./utils/expressError')

const dbUrl = 'mongodb://localhost:27017/apucp';

// Database Connection
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Database connected: ${dbUrl} `);
}).catch((e) => {
    console.log("OH NO ERROR!!!!");
    console.log(e);
});

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(
    session({
        secret: "thisisnotagoodsecret",
        resave: false,
        saveUninitialized: false,
    })
);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Route
app.use('/confessions', require('./routes/confessions'))

// Routing
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/disclaimer', (req, res) => {
    res.render('disclaimer')
})

app.get('/guidelines', (req, res) => {
    res.render('guidelines')
})

app.get('/information', (req, res) => {
    res.render('information')
})

app.get('/apucp-admin', (req, res) => {
    res.render('admin/signin')
})

// Error Handler
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "OH NO! SOMETHING WENT WRONG.";
    }
    res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening port: ${port}`)
})