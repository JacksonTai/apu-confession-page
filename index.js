const express = require('express')
const app = express()
const path = require('path')

// Middleware
app.use(express.static(path.join(__dirname, "public")));

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
    res.render('admin/login')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('listening port 3000')
})