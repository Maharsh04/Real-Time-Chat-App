require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey : process.env.PUBLIC_KEY,
    privateKey : process.env.PRIVATE_KEY,
    urlEndpoint : process.env.URLENDPOINT
});

passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser(function(user, done) {
	done(null, user);
});

let name,picture;
passport.use(new GoogleStrategy({
	clientID: process.env.CLIENT_ID, 
	clientSecret: process.env.CLIENT_SECRET, 
	callbackURL: process.env.CALLBACKURL,
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
    // name=profile.displayName;
    picture=(profile.photos[0].value).toString();
	return done(null, profile);
}
));

app.use(session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
}));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.get('/chat',(req,res)=>{
    res.render('chat');
})
app.get('/profile', (req, res) => {
    res.render('profile');
})
app.get('/', (req, res) => {
    res.render('home');
})

// Auth
app.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Auth Callback
app.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/google/callback/success',
    failureRedirect: '/google/callback/failure'
}));

// Success
app.get('/google/callback/success', (req, res) => {
    if (!req.user)
        return res.redirect('/google/callback/failure');
    res.render('profile');
});

// Failure
app.get('/google/callback/failure', (req, res) => {
    res.send("Error");
});


io.on('connection',(socket)=>{
    socket.on('userinfo',(username)=>{
        name=username;
        // picture = imagekit.url({
        //     path : profilepic,
        //     urlEndpoint : "https://ik.imagekit.io/fp2fooqlc/endpoint/",
        //     transformation : [{
        //         "height" : "300",
        //         "width" : "400"
        //     }]
        // });
        console.log(name);
        console.log(picture);
    })
    socket.emit('info', name,picture);
    socket.on('send', (message) => {
        socket.broadcast.emit('userMessage', message,name,picture);
    })

})

server.listen(3000);