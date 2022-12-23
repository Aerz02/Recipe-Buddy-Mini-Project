// Import the modules we need
var express = require('express');
var ejs = require('ejs');
var bodyParser= require('body-parser');
const mysql = require('mysql');
var session = require('express-session');
const { check, validationResult } = require('express-validator');
const expressSanitizer = require('express-sanitizer');
// pasword encryption module 
const bcrypt = require('bcrypt');

// Create the express application object
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({extended: true}));

// Create an input sanitizer
app.use(expressSanitizer());

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {expires: 600000},
    userId: undefined
}));

// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'Samsung001234!!',
    database: 'RecipeBuddy'
});
// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

global.db = db;

// Set the directory where Express will pick up HTML files
// __dirname will get the current directory
app.set('views', __dirname + '/views');

// Set up css links
app.use(express.static(__dirname + '/public'));

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Tells Express how we should process html files
// We want to use EJS's rendering engine
app.engine('html', ejs.renderFile);

var appData = {appName: "Recipe Buddy"}
// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// once logged in can pages be accessed
const redirectLogin = (req, res, next) => {
    if (!req.session.userId)  res.redirect('./login')
    else next(); 
}

// home page route
app.get('/', (req, res) => {
    let newData = Object.assign({}, appData, {loggedin: req.session.userId});
    res.render('index.ejs', newData)
});

// about page route
app.get('/about', (req, res) => { 
    let newData = Object.assign({}, appData, {loggedin: req.session.userId});
    res.render('about.ejs', newData)
});
// register page route
app.get('/register', (req, res) => {
    let newData = Object.assign({}, appData, {loggedin: req.session.userId});  
    res.render('register.ejs', newData)
});

// registering user to database
app.post('/registered', 
[
    check('email', 'Not an email').exists().isEmail().normalizeEmail(),
    check('password', 'Password Must Be at Least 8 Characters').exists().isLength({ min: 8 }),
    check('username').exists().isAscii()
], (req, res) => {
    // checks validation
    const errors = validationResult(req);
    //if there are error, redirect to the register page
    if (!errors.isEmpty()){
        const alerts = errors.array();
        let newData = Object.assign({}, appData, {loggedin: req.session.userId}, {alerts}); 
        res.render('./register', newData);
    }
    else { 
        // saving data in database
        const saltRounds = 10;
        // sanitising the password
        const plainPassword = req.sanitize(req.body.password);
        bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
            if (err) return err.stack;
            // Store hashed password in your database
            let sqlquery = 'INSERT INTO users (first, last, username, email, password) VALUES( ?, ?, ?, ?, ?)';
            let newUser = [req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.username), req.sanitize(req.body.email), hashedPassword];
            db.query(sqlquery, newUser, (err, result) => {
                if (err) return console.error(err.message);
            });
            message = 'Hello ' + req.sanitize(req.body.first) + ' ' + req.sanitize(req.body.last) + ' you are now registered! We will send an email to you at ' + req.sanitize(req.body.email);
            message += '<br>Your password is: ' + plainPassword + ' and your hashed password is: ' + hashedPassword + '<br><a href=' + './' + '> Home page</a>';
            res.send(message);
        });
    }
});

// login page route
app.get('/login', (req, res) => {
    let newData = Object.assign({}, appData, {loggedin: req.session.userId});
    res.render('login.ejs', newData)
});

// logging in 
app.post('/loggedin', [
    check('user').isAlphanumeric(),
    check('pass').isLength({ min: 8 }).matches('[0-9]').matches('[A-Z]').matches('[a-z]')
],(req, res) => {
    // user object for sanitised form inputs
    let user = {username: req.sanitize(req.body.username), password: req.sanitize(req.body.password)};
    //checks if user exists
    let sqlquery = "SELECT username, password FROM users WHERE username = ?";
    db.query(sqlquery, [user.username], (err, result) => {
        //redirect to home page if there's an error
        if (err) 
        console.log(err.message);
        // checks if an empty set is returned
        else if (result.length === 0) 
            res.send("User " + user.username + " doesn't exists. If you want you can register with it. " + '<a href=./register>Register page</a>' + '<br> <a href=./>Home page</a>')
        // user exists
        else {
            console.log("User " + user.username + " does exist.");
            // Compare the password supplied with the password in the database
            bcrypt.compare(user.password, result[0].password, (err, result) => {
                // return error message if there's an error
                if (err) console.error(err.message);
                // passwords match
                else if (result) {
                    // Save user session here, when login is successful
                    req.session.userId = user.username;
                    console.log(user.username + " has logged in successfully.");
                    res.send(user.username + " has logged in successfully " + '<a href=./>Home page</a>');
                }
                // password don't match
                else res.send("Incorrect Password" + "<br>" +  '<a href=./login>Login</a>');
                
            });
        }
    });
});

//logout route
app.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        //redirect to home page if there's an error
        if (err) return res.redirect('./')
        res.send('you are now logged out. <a href=' + './' + '> Home page</a>');
    });
});

// add food page route
app.get('/addfood', redirectLogin, (req, res) => {
    let newData = Object.assign({}, appData, {loggedin: req.session.userId});
    res.render('addfood.ejs', newData)
});
// adding food to database
app.post('/foodadded', (req, res) => {
    // console.log(req.body.food);
    let newFood = [req.sanitize(req.body.name), req.sanitize(req.body.typical_value),
        req.sanitize(req.body.typical_value_unit),req.sanitize(req.body.carbs),
        req.sanitize(req.body.fats),req.sanitize(req.body.protein),
        req.sanitize(req.body.salt), req.sanitize(req.body.sugar),
        req.session.userId
    ];
    console.log(newFood);
    let sqlquery = "INSERT INTO foods (name ,typical_value, typical_value_unit, carbs, fats, protein, salt, sugar, username)" +
    "VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sqlquery, newFood, (err, result) => {
        if (err) console.error(err.message);
        else res.send(req.session.userId + " has added " + req.body.name + ' <a href=./addfood>Add another food</a> <br> <a href=./> Home page</a>');
    });
    
});

// search food page route
app.get('/search', (req,res) => {
    let newData = Object.assign({}, appData, {loggedin: req.session.userId});
    res.render('search.ejs', newData);
});

// search result with food name
app.get('/search-result', (req, res) => {
    let sqlquery = "SELECT * FROM foods WHERE name LIKE'%" + req.sanitize(req.query.name) + "%'";
    db.query(sqlquery, (err,result) =>{
        if (err) res.redirect('./searchfood');
        else if (result.length === 0) res.send("Food item not found if you wish to add it. <a href=/addfood>Add Food</a> <br> <a href=./>Home page</a>" );
        else{
            let newData = Object.assign({}, appData,{loggedin: req.session.userId}, { foods: result });
            console.log(newData);
            res.render('listfood.ejs', newData);
        }
    });
});

// update food page route
app.get('/updatefood', redirectLogin, (req, res) => {
    let newData = Object.assign({}, appData, {loggedin: req.session.userId});
    res.render('updatesearchfood.ejs', newData);
});

// update search result
app.get('/update-search-result', [check('name').exists().isAlpha()], (req, res) => {
    let sqlquery = "SELECT * FROM foods WHERE name LIKE'%" + req.sanitize(req.query.name) + "%'";
    db.query(sqlquery, req.sanitize(req.query.name), (err, result) => {
        console.log(result);
        if (err) res.redirect('./updatefood');
        else if (result.length === 0) 
            res.send("Food item not found if you wish to add it. <a href=/addfood>Add Food</a> <br> <a href=./>Home page</a>" );
        else{
            let newData = Object.assign({}, appData, {loggedin: req.session.userId}, {foods: result}, {searchedFood: req.sanitize(req.query.name)});
            // console.log(newData);
            res.render('updatefood.ejs', newData);
        }
    });
});

app.post('/foodupdated', 
[
    check('name').exists().isAlpha(),
    check('typical_value').exists().isLength({ min: 1 }).matches('[0-9]'),
    check('typical_value_unit').exists().isAlpha(),
    check('carbs').exists().isFloat(),
    check('fats').exists().isFloat(),
    check('protein').exists().isFloat(),
    check('salt').exists().isFloat(),
    check('sugar').exists().isFloat()
], (req, res) => {
    console.log(req.body);
    let updatedDetails = [req.sanitize(req.body.name), req.sanitize(req.body.typical_value),
        req.sanitize(req.body.typical_value_unit),req.sanitize(req.body.carbs),
        req.sanitize(req.body.fats),req.sanitize(req.body.protein),
        req.sanitize(req.body.salt), req.sanitize(req.body.sugar)
    ];
    let sqlquery = "SELECT * FROM foods WHERE name = ?";
    db.query(sqlquery, req.sanitize(req.body.name), (err,result) => {
        if (err) console.error(err.message);
        if (result[0].username !== req.session.userId){ 
            Window.alert("You are not the creator of this food, you can't update this!!!");
            // res.status(403);
        }
        else{
            console.log(result);
            updatedDetails.push(result[0].food_id);    
            let sqlquery = " UPDATE foods SET name = ?, typical_value = ? , typical_value_unit = ?, carbs = ?, fats = ?, protein = ?, salt = ?, sugar = ? WHERE food_id = ? ";
            db.query(sqlquery, updatedDetails, (err, result) => {
                if (err) console.error(err.message);
                else{
                    let message = "Food item: " + req.sanitize(req.body.name) + " has been updated with the following values: <br>" +
                    "Typical Value: " + req.sanitize(req.body.typical_value) + "<br>" +
                    "Typica; Value Unit: " + req.sanitize(req.body.typical_value_unit) + "<br>" +
                    "Carbs: "+ req.sanitize(req.body.carbs) +" "+ req.sanitize(req.body.typical_value_unit) + "<br>" +
                    "Fats: " + req.sanitize(req.body.fats) +" "+ req.sanitize(req.body.typical_value_unit) + "<br>" +
                    "Protein: " + req.sanitize(req.body.protein) +" "+ req.sanitize(req.body.typical_value_unit) + "<br>" +
                    "Salt: " + req.sanitize(req.body.salt) +" "+ req.sanitize(req.body.typical_value_unit) + "<br>" +
                    "Sugar: " + req.sanitize(req.body.sugar) +" "+ req.sanitize(req.body.typical_value_unit) + "<br>"
                    + '<a href=./>Home page</a>';
                    res.send(message);
                }
            });
        }
    })    
});
    
app.post('/fooddeleted', [check('name').isAlphanumeric()], (req, res) => {
    console.log(req.body);
    //Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.send(errors.array);
    else {
        let sqlquery = 'SELECT * FROM foods WHERE name = ?';
        db.query(sqlquery, req.sanitize(req.body.name), (err, result) => {
            console.log(result);
            if (result[0].username != req.session.userId) 
                res.send("Only " + req.session.userId + " can delete this food item form the database")
            else if (err) console.error(err.message);
            else{
                //Finding the record in the database to delete
                let sqlquery = "DELETE FROM foods WHERE name = ?";
                // execute sql query
                db.query(sqlquery, result[0].name, (err, result) => {
                    if (err) {
                        console.error(err.message);
                        res.redirect('./');
                    }
                    else if (result.length === 0) {
                        console.log(result);
                    }
                    else {
                        console.log(result);
                        res.send(' Record for food:' + req.body.name + ' has been deleted. <br> <a href=' + './' + '>Home page</a>' 
                        + '<a href=./listfood> List foods</a>');
                    }
                });
            }    
        })    
    }
});
    
// list food page route
app.get('/listfood', (req, res) => {
    // retrieve everything from the foods table
    let sqlquery = "SELECT * FROM foods;"
    // Execute the sql query
    db.query(sqlquery, (err,result) => {
        if (err) console.error(err.message);
        else {
            let newData = Object.assign({}, appData, {loggedin: req.session.userId}, {foods: result});
            res.render('listfood.ejs', newData);
        }    
    });
});
// api route 
app.get('/api', (req, res) => {
    // retrieve everything from the foods table
    let sqlquery = "SELECT * FROM foods;";
    // Execute the sql query
    db.query(sqlquery, (err, result) => {
        if (err) res.redirect('./');
        console.log(result);
        // Return results as a JSON object
        res.json(result);
    });
});