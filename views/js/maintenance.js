function signOut(){
  firebase.auth().signOut().then(function() {
  window.location = "/signin"
  console.log('Signed Out');
}, function(error) {
  console.error('Sign Out Error', error);
  window.location = "/"
});
  }
  

 firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var uid = user.uid;
  } else {
	window.location = "/"
  }
});


  

function comment(usertoken,akey){

  $(document).on('click', '.comment', function() {
  
    var com = $(this).prevAll("textarea").val();
	if(com != ""){
firebase.database().ref("requests").child(akey).child(usertoken).update({
comment: com
});
location.reload()
   }
   else{
   alert("Please Enter an input")
   }
   
	
  });

  }
  



  function addrepair(usertoken,akey){

  $(document).on('click', '.assign', function() {
  
    var name = $(this).prevAll(".repairname").val();
    var num = $(this).prevAll(".repairnum").val();
	if(name != "" && num != ""){
	firebase.database().ref("requests").child(akey).child(usertoken).update({
assignname: name,
assignnum: num,
assigned: "true"
});

location.reload()
}
else{
alert("Please Enter an input")
}
   
	
  });
 

  }
  
  
  
  function loadreq(){
   
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
 
  var dbref = firebase.database().ref("requests")
  var user = firebase.auth().currentUser;
  var usertoken = user.uid;
  
  dbref.child(usertoken).on('value', function(snapshot) {
  var data = snapshot.val();
   $("table #tbl").remove();
  for(prop in data){
  var markup = "<tr id = 'tbl'><td>" + data[prop]['equipment'] + "</td><td>" + data[prop]['description'] + "</td><td>" + data[prop]['details'] + "</td><td>" + data[prop]['date'] + "</td><td>" + data[prop]['status'] + "</td><td>" + data[prop]['comment'] + "</td></tr>";
           $("table").append(markup);
          
		   
		   
  }
});
}
});
 
  }


function loadnotif(){

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
 
  var dbref = firebase.database().ref("notifications")
  var user = firebase.auth().currentUser;
  var usertoken = user.uid;
  
  dbref.child(usertoken).on('value', function(snapshot) {
  var data = snapshot.val();
  for(prop in data){
  var markup = "<p> "+ data[prop]["Message"] + "</p>"
           $("#notify").append(markup);
          
       
       
  }
});
}
})

}

loadnotif();




  
   
  
   function createrep(){
  var equip = $("#equpid").val()
  var describe = $("#description").val()
  var detail = $("#detail").val()
  var depart = $("#department").val()
  var d = new Date;

if (equip != "" && describe != "" && detail != "" && depart != ""){
  var today = d.getFullYear() + '/' + ('0'+(d.getMonth()+1)).slice(-2) + '/' + ('0'+d.getDate()).slice(-2);
  var dbref = firebase.database().ref("requests")
  var user = firebase.auth().currentUser;
  var userId = user.uid;
  var dbkey = dbref.child(userId).push().key;
  dbref.child(userId).child(dbkey).update({
  equipment: equip,
  description: describe,
  details: detail,
  date: today,
  status: "pending",
  comment: "none",
  department: depart,
  approved: "false",
  reject: "false",
  assigned: "none",
  akey: dbkey,
  userid: userId,
  assignname: "false",
  assignnum: "false",
  resolve: "false",
  });

  alert("Your Request Have been Created")
  $("#equpid").val("")
  $("#description").val("")
  $("#detail").val("")
  $("#department").val("")
}
else{
  alert("One of the input is empty.")
}
  
  
  }
  

  function adminloadreq(){
   
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  var dbref = firebase.database().ref("requests")
  dbref.on('value', function(snapshot) {
  var data = snapshot.val();
 // console.log(snapshot.val());
  for(prop in data){
  ndata = data[prop]
  for(nprop in ndata){
  //console.log(ndata.key())
  var nkey = ndata[nprop]['akey'] 
  var ukey = ndata[nprop]['userid']
  var markup = "<tr id = 'tbl'><td>" + ndata[nprop]['equipment'] + "</td><td>" + ndata[nprop]['description'] + "</td><td>" + ndata[nprop]['details'] + "</td><td>" + ndata[nprop]['date'] + "</td><td>" + ndata[nprop]['status'] + "</td><td>" + ndata[nprop]['comment'] + "</td><td>" + ndata[nprop]['department'] + "</td></tr>";
  var markup2 = '<td><button id = "approve" class = "action" onclick = "approve(\'' + nkey + '\',\'' + ukey +  '\')"> Approve</button><br><br></td>' 
  var markup3 = '<td><button id = "reject" class = "action" onclick = "reject(\'' + nkey + '\',\'' + ukey +  '\')"> Reject</button><br><br></td>'
  var markup4 = '<td>Name: &nbsp&nbsp <input type = "text" class = "repairname" placeholder = "Input the name of repairer"><br> <br>Phone No: <input type = "text" class = "repairnum" placeholder = "Phone Number"><button class = "action assign" onclick = "addrepair(\'' + nkey + '\',\'' + ukey +  '\')">Add Repairer</button><br><br></td>' 
  var markup5 = '<td><textarea placeholder = "Add Comment" class = "commentbox"></textarea><br><br><button class = "comment action" onclick = "comment(\'' + nkey + '\',\'' + ukey +  '\')"> Add Comment</button><br><br></td></tr>'
  var markup6 = '<td><button id = "resolve" class = "action" onclick = "resolve(\'' + nkey + '\',\'' + ukey +  '\')"> Click if Resolved</button><br><br></td>' 
  //var markup6 = "<input type = 'hidden' value = n
  var markupi;
  
  if (ndata[nprop]['approved'] == "true"){
  markupi = markup4 + markup5
  } else if(ndata[nprop]['reject'] == "true"){
  markupi = markup5
  }
  else{
  markupi = markup2 + markup3
  }
  
  if(ndata[nprop]['comment'] != "none"){
  markupi = markup4
  }
 
if(ndata[nprop]['comment'] != "none" && ndata[nprop]['assigned'] != "none"){
  markupi = markup6
  }
 
if(ndata[nprop]['comment'] == "none" && ndata[nprop]['assigned'] != "none"){
  markupi = markup5
  }

 if(ndata[nprop]['reject'] == "true" && ndata[nprop]['comment'] != "none"){
  markupi = ""
  }

if(ndata[nprop]['resolve'] == "true"){
  markupi = ""
  }

   $("table").append(markup,markupi);
  }
  	   
  }
});
}
})
 
 
 
  }

function approve(akey,usertoken){

  firebase.database().ref('requests').child(usertoken).child(akey).on('value', function(snapshot) {
  var reqdetail = snapshot.val();
var reqname = reqdetail["equipment"]
var reqdate = reqdetail["date"]


firebase.database().ref("notify").set({
notify: 1
})


 firebase.database().ref("requests").child(usertoken).child(akey).update({
status: "approved",
approved: "true"
})

 firebase.database().ref("notifications").child(usertoken).push({
Message: "Your Request on " + reqdate  + " about " + reqname +  " have been Appproved"
})
 });
location.reload()
}




function reject(akey,usertoken){

  firebase.database().ref('requests').child(usertoken).child(akey).on('value', function(snapshot) {
  var reqdetail = snapshot.val();
var reqname = reqdetail["equipment"]
var reqdate = reqdetail["date"]

firebase.database().ref("notify").set({
notify: 1
})

firebase.database().ref("notifications").child(usertoken).push({
Message: "Your Request on " + reqdate  + " about " + reqname +  " have been Rejected"
})

 firebase.database().ref("requests").child(usertoken).child(akey).update({
status: "rejected",
reject: "true"
});
 });
location.reload()
}

function resolve(akey,usertoken){
 firebase.database().ref("requests").child(usertoken).child(akey).update({
status: "Resolved",
resolve: "true"
})
location.reload()
}
   
  
  

  

  
  function admin(){
   $("#adminwelcome").show();
   $("#adminmenu").show();
   $("#staffwelcome").hide();
   $("#staffmenu").hide();
   $("#admincon").show();
   $("#adminmenu1").show();
  }
  
  
  function staff(){
  $("#adminwelcome").hide();
   $("#adminmenu").hide();
   $("#staffwelcome").show();
   $("#staffmenu").show();
    $("#staffcon").show();
    $("#staffmenu1").show();
   
  }
  
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var userId = firebase.auth().currentUser.uid;
	firebase.database().ref('users').child(userId).once('value').then(function(snapshot) {
	var userdetail = snapshot.val();
	var fullname = userdetail["Fullname"];
	var username = userdetail["Username"];
	var level = userdetail["level"];
	if(level == 2){
	admin()
	adminloadreq()
	} else{
	staff()
	loadreq()
	}
	
	});

  } else {
	window.location = "/"
  }
  
  });
  









function fileUpload(){
var file = document.getElementById("file").files[0]
console.log(file)
var fileName = file.name;
console.log(file)
var storageRef = firebase.storage().ref("images");
var spaceRef = storageRef.child(fileName);
var uploadTask = spaceRef.put(file);
document.getElementById("file").value = "";
alert("Your file have been uploaded");
}








