const express = require('express');

var morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Time = require('./models/leaderboard');

const mongoose = require('mongoose');

//DB Connection
mongoose.connect(
    'mongodb+srv://nssthunt:nssthunt123@cluster0-3pzjk.mongodb.net/test?retryWrites=true',
    { useNewUrlParser: true },
    err => {
        if (!err) {
            console.log('Connected to mongodb successfully');
        } else {
            console.log(err);
        }
    }
);

const app = express();

// Time Null Object
const Tnull = {
    hour: null,
    min: null,
    sec: null,
};

// body
app.use(bodyParser.urlencoded({ extended: true }));

// Logging
// app.use(morgan('combined'));

//PASSPORT config
app.use(
    require('express-session')({
        secret: 'we people are the greatest on the planet',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Login check
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

// Engine
app.set('view engine', 'ejs');
// public
app.use(express.static('public'));

// Desert
app.get('/desert', isLoggedIn, (req, res) => {
    var tnow = new Date();
    var time = {
        user: req.user.username,
        timestart: {
            hour: tnow.getHours(),
            min: tnow.getMinutes(),
            sec: tnow.getSeconds(),
        },
        timedesert: Tnull,
        timepyramid: Tnull,
        timemessyroom: Tnull,
        timepuzzle: Tnull,
        timeend: Tnull,
    };

    const query = { user: req.user.username };

    Time.findOneAndUpdate(query, time, { upsert: true }, (err, data) => {
        if (err) {
            console.log(err);
        }
    });

    res.render('desertScenary');
});

app.post('/desert', function(req, res) {
    var tnow = new Date();
    var time = {
        timedesert: {
            hour: tnow.getHours(),
            min: tnow.getMinutes(),
            sec: tnow.getSeconds(),
        },
    };

    const query = { user: req.user.username };

    Time.findOneAndUpdate(query, time, { upsert: false }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data);
    });
    res.redirect('/pyramid');
});
// End Desert

// Pyramid
app.get('/pyramid', isLoggedIn, (req, res) => {
    res.render('pyramid');
});

app.post('/pyramid', function(req, res) {
    var tnow = new Date();
    var time = {
        timepyramid: {
            hour: tnow.getHours(),
            min: tnow.getMinutes(),
            sec: tnow.getSeconds(),
        },
    };

    const query = { user: req.user.username };

    Time.findOneAndUpdate(query, time, { upsert: false }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data);
    });
    res.redirect('/messyroom');
});
// End pyramid

// Messyroom
app.get('/messyroom', isLoggedIn, (req, res) => {
    res.render('messyroom');
});
app.post('/messyroom', function(req, res) {
    var tnow = new Date();
    var time = {
        timemessyroom: {
            hour: tnow.getHours(),
            min: tnow.getMinutes(),
            sec: tnow.getSeconds(),
        },
    };

    const query = { user: req.user.username };

    Time.findOneAndUpdate(query, time, { upsert: false }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data);
    });
    res.redirect('/puzzle');
});
// End Messyroom

// Puzzle
app.get('/puzzle', isLoggedIn, (req, res) => {
    res.render('imagePuzzle');
});

app.post('/puzzle', function(req, res) {
    var tnow = new Date();
    var time = {
        timepuzzle: {
            hour: tnow.getHours(),
            min: tnow.getMinutes(),
            sec: tnow.getSeconds(),
        },
    };

    const query = { user: req.user.username };

    Time.findOneAndUpdate(query, time, { upsert: false }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data);
    });
    res.redirect('/leaderboard');
});
//End puzzle

// leaderboard
app.get('/leaderboard', (req, res) => {
    Time.find({}, function(err, docs) {
        if (!err) {
            // console.log(docs.length);
            res.render('lead', {
                user: docs,
            });
        } else {
            console.log(err);
        }
    });
});

// login
app.get('/', (req, res) => {
    res.render('signin');
});

// Check Success
app.get('/checksuccess', (req, res) => {
    Time.find({ user: req.user.username }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        console.log(docs[0]);
        if (
            docs[0] &&
            (docs[0].timepuzzle.hour ||
                docs[0].timepuzzle.min ||
                docs[0].timepuzzle.sec)
        ) {
            res.render('terminate');
        } else {
            res.redirect('/desert');
        }
    });
});

app.post(
    '/',
    passport.authenticate('local', {
        successRedirect: '/checksuccess',
        failureRedirect: '/',
    }),
    (req, res) => {}
);

//Auth
app.get('/thuntreg', (req, res) => {
    res.render('signup');
});

app.get('/regtrue', (req, res) => {
    res.render('regsuccess');
});

app.post('/thuntreg', (req, res) => {
    var newUser = new User({ username: req.body.username });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('/register');
        }
        console.log(req.body.username);
        res.redirect('/regtrue');
    });
});

//logout
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(3000 || process.env.PORT, process.env.IP, () => {
    console.log('Server has started');
});
