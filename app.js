var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose       = require("mongoose");
var express        = require("express");
var app            = express();

// APP CONFIG
//mongoose.connect("mongodb://localhost/my_blog_app");
mongoose.connect("mongodb://nitingahlawat0007:eyeofthetiger7@ds217138.mlab.com:17138/nitinblog");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// mongoose configuration
var blogSchema = new mongoose.Schema({
    title:String,
    body:String,
    image:String,
    created:({type:Date,default:Date.now})
    
});
 var Blog= mongoose.model("Blog",blogSchema);    // database can be accesed using Blog variable

/*Blog.create({
    title: "My first blog",
    body: "hello this is my blog",
    image:"https://images.unsplash.com/photo-1490323948794-cc6dde6e8f5b?auto=format&fit=crop&w=726&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D"
    
    
});
*/



// routes

app.get("/",function(req, res) {
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error occured");
        }
        else{
            res.render("index",{blogs:blogs});   // first blog is database second is one we defined in this fn
        }
    });
    
    
   
});
app.get("/blogs/new",function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res){
    // create blog
    console.log(req.body);
    console.log("===========");
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id", function(req, res){
Blog.findById(req.params.id,function(err,foundBlog){
   if(err){
       res.redirect("/blogs");
   }
   else{
      res.render("show",{blog:foundBlog}) ;
   }
   
});
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
    
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});
 
 app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    }) ;
 });


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Your blog is connected"); 
});