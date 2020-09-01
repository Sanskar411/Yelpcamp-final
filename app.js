var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var flash       = require("connect-flash");
const mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride= require("method-override");
var Campground=require("./models/campground");
var Comment     = require("./models/comment"),
	User        = require("./models/user"),
    seedDB      = require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12deployed"
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//mongoose.connect('mongodb+srv://Sanskar:Manojandmanju98@cluster0.jzj30.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
 // useNewUrlParser: true,
//  useUnifiedTopology: true
//})
//.then(() => console.log('Connected to DB!'))
//.catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT ROUTES
app.use(require("express-session")({
	secret:"Once again rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});