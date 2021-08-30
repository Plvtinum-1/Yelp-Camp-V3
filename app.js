if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;

//Connecting to MongoDB Locally
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

//setting the template engine to be EJS
app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


//this is setting where a user session will expire
const sessionConfig = {
    secret: 'this-is-a-secret',
    resave: false,
    saveUninitialized: true,
    //store: 'sdadasd',
    cookie: {
        httpOnly : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//using the flash package with express
app.use(flash());

//using passport for authentication
app.use(passport.initialize());
//make sure that passport.session is used after app.use.session
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware for displaying flash messages
app.use( (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({email: 'ismail@gmail.com', username: 'ismail'})
//     const newUser = await User.register(user, '123');
//     res.send(newUser);
// })


//getting routes from the routes folder
app.use('/campgrounds', campgroundRoutes);
app.use('/', reviewRoutes);
app.use('/', userRoutes);

//defining the static folder which is called public
app.use(express.static(path.join(__dirname, 'public')))

//Home Route
app.get('/', (req, res) => {
    res.render('home')
});

//Handling Error Routes
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh Boy, Something Went Wrong!'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})