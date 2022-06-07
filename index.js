const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Routes
app.use('/confessions', require('./routes/confessions'))

// Routing
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/guidelines', (req, res) => {
    res.render('guidelines')
})

app.get('/apucp-admin', (req, res) => {
    res.render('admin/login')
})

app.listen(3000, () => {
    console.log('listening port 3000')
})