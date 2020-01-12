var    express = require("express");
var        app = express();
var bodyParser =  require("body-parser");
var   mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
	
});


var Campground = mongoose.model("campground", campgroundSchema);

// Camground.create(
// 	{
// 	   name: "Granite Hill",
// 	   image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg",
// 	   description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
	
//    }, function(err, campground){
// 	   if(err){
// 		   console.log(err);
// 	   } else {
// 		  console.log("NEWLY CREATED CAMPGROUND: ")
// 		  console.log(campground);
// 	   }
	   
//    });


app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	// Get all campgrounds from DB
		Campground.find({}, function(err, allCampgrounds){
			if(err){
				console.log(err);
			} else {
				 res.render("index", {campgrounds: allCampgrounds});
			}
			
		});
	
});

//CREATE - add new campgrounds to DB
app.post("/campgrounds", function(req, res){
	
	// get data from form and add to campgrounds array
	var name  = req.body.name;
	var image = req.body.image;
	var desc   = req.body.description;
	var newCampground = {name: name, image:image, description: desc}
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
		
	});
	
});

//NEW - Show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
	
});

//SHOW - shows more info about each campground
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			res.render("show", {campground: foundCampground});
		}
		
	});
			
});


app.listen(3000, function(){
	console.log("The YelpCamp Sever has Started");
});