var express = require("express");
var path = require("path");
var router = express.Router();
var viewpath = path.join(__dirname,"views/")
var app = express();
app.use(express.static(viewpath));

router.get("/",function(req,res){
	res.sendFile(viewpath + "index.html")
})

router.get("/signin",function(req,res){
	res.sendFile(viewpath + "signin.html")
})

router.get("/signup",function(req,res){
	res.sendFile(viewpath + "signup.html")
})


router.get("*",function(req,res){
	res.send("404 not found")
})

app.use("/",router)

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});