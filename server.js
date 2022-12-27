const express = require('express')
const mysql = require('mysql')
const app = express()
const bodyParser = require('body-parser')
const jsdom = require ('jsdom')
const session = require ('express-session')
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

app.set('view-engine', 'ejs')
app.use (express.urlencoded ({ extended: false }))

app.use (express.static(__dirname + '/public'))

app.use (bodyParser.urlencoded ({ extended: true }))


const db = mysql.createConnection ({
    host: "localhost",
    database: "buku_tamu",
    user: "root",
    password: "1234",
})

app.listen (3000, () => {
    console.log ('server ready...')
})
db.connect ((err) => {
    if (err) throw err
    console.log ("database connected...")
    const sql = "SELECT * FROM user"
    
    app.post ('/register', (req,res) => {
        
        const insertSql = `INSERT INTO USER (username, email, password) VALUES ('${req.body.username}', '${req.body.email}', '${req.body.password}');`
        db.query(insertSql, (err, result) => {
            if (err) throw err
            res.redirect ('/')
        })
    })
    
    app.post ('/login', (req,res) => {
       let username = req.body.username
       let password = req.body.password

       if (username && password) {
        db.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (err, result, fields) => {
            if (err) throw err
            const users = JSON.parse(JSON.stringify(result))
            if (users == '') {
                res.send ("email or password incorrect")
                res.end()
            } else {
                res.redirect ('/login')
            }
            
            app.get ('/login', (req, res) => {
                res.render ('index.ejs', { name: username }) 
                console.log (username) 
            })
            
            db.query ('SELECT id, username, email FROM user', (err, result) => {
                const users = JSON.parse (JSON.stringify(result))
                app.get ('/guest', (req, res) => {
                    res.render ('guest.ejs', {users: users})
                    console.log (users)
                })
            })
           
            
            
        })
    }
    
})
app.get ('/register', (req, res) => {
    res.render ('register.ejs')
})
app.get ('/', (req, res) => {
    res.render ('login.ejs')
})

})

