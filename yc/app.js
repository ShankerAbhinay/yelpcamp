const express 	 = require("express"),
	  app 		 = express(),
      bodyParser = require("body-parser"),
	  mongoose 	 = require('mongoose'),
	  Campground = require("./models/campground"),
	  Comment 	 = require("./models/comment"),
	  seedDB = require("./seeds.js"),
	  path = require('path');

mongoose.connect("mongodb://localhost/yelp_camp",{
	useNewUrlParser: true,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"styles")));
//console.log(__dirname);
seedDB();

// Campground.create(
// {
// 	name: "Abhinay Shanker",
// 	image: "https://assets.traveltriangle.com/blog/wp-content/uploads/2016/10/Camping-Sites-Near-Bangalore.jpg",
// 	description: "This is a huge granit hill, no bathrooms, no water. Beautiful granite."
// }).then((campground)=>{
// 		console.log("Newly created campground");
// 		console.log(campground);
// }).catch((err)=>{
// 	console.log(err);
// });


app.get("/",(req,res) => {
	res.render("landing");
});

//index route - shows all the campgrounds 
//used to retrieve all the campgrouds details from the db
app.get("/campgrounds",(req,res) => {
	Campground.find({}, (err,allCampgrounds) => {
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	})
});

//create route - add new campgrounds to the db
app.post("/campgrounds",(req,res) =>  {
	//get data from the form & add to campgrounds array
	var name = req.body.name; //taking from the form and setting into these variables 
	var img = req.body.image;
	var description = req.body.description;
	var newCampground = {name:name,image:img,description:description} // we are adding these from the above variables
	//Create a new campground and save to db
	Campground.create(newCampground,(err,newlyCreated) => {
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
}); 

//new route = shows form to create a new campgrounds  
app.get("/campgrounds/new",(req,res) => {
	res.render("campgrounds/new");
});

//show -route to show only one particular route
// app.get("/campgrounds/:id",async(req,resp) => {
// 	//find the route with that id and 
// 	try {
// 		let res = await Campground.findById(req.params.id);
// 		resp.render("show",{campground:res});
// 	}catch(err) {
// 		console.log(err);
// 	}
// 	});

app.get("/campgrounds/:id",(req,resp) => {
	//find the route with that id and 
	console.log(typeof(req.params.id));
	Campground.findById(mongoose.Types.ObjectId(req.params.id)).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			//render the show template with that campground
			resp.render("campgrounds/show",{campground:foundCampground});
		}
	});
});

//=======================
//route for the comments section
//=======================
app.get("/campgrounds/:id/comments/new",(req,res) => {
	//find campground by id
	Campground.findById(req.params.id,(err,campground) => {
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});
		}
	});
});

app.post("/campgrounds/:id/comments",(req,res) => {
	//lookup campground using iD
	Campground.findById(req.params.id,(err,campground) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			//create new comment
			Comment.create(req.body.comment,(err,comment) => {
				if(err){
					console.log(err);
				}else{ 
					campground.comments.push(comment);
					campground.save();
					//redirect to campground show page
					res.redirect('/campgrounds/'+ campground._id);
				}
			});
		}
	});
});
 
//should show the form data which is being sent to the post route
app.listen(3000,() => console.log("Yelpcamp Server has been started!!!"));