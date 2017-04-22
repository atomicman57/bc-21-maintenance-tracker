/**
 * This is maintenance page javascript
 * This js is for both Staff and Admin
 */




/**
 * Sign Out Function
 * This function sign out the user and redirect to sign in page
 * It uses the firebase sign out function
 * It handles error too
 */
function signOut() {
    firebase.auth().signOut().then(function() {
        window.location = "/signin"
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
        window.location = "/"
    });
}


/**
 * This firebase function check if the user accessing this page is signed in
 * This can only be view if user is signed in
 * If user is not signed in, it redirect to the home page
 */


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let uid = user.uid;
    } else {
        window.location = "/"
    }
});


/**
 * Comment Function
 * Only admin have access to this function
 * @param {string} The user id of the staff that make the request 
 * @param {string} The id/key of the request on firebase database
 */

function comment(usertoken, akey) {

    $(document).on('click', '.comment', function() {

        let com = $(this).prevAll("textarea").val();
        if (com != "") {
            firebase.database().ref("requests").child(akey).child(usertoken).update({
                comment: com
            });
            location.reload()
        } else {
            alert("Please Enter an input")
        }


    });

}




function addRepair(usertoken, akey) {

    $(document).on('click', '.assign', function() {

        let name = $(this).prevAll(".repairname").val();
        let num = $(this).prevAll(".repairnum").val();
        if (name != "" && num != "") {
            firebase.database().ref("requests").child(akey).child(usertoken).update({
                assignname: name,
                assignnum: num,
                assigned: "true"
            });

            location.reload()
        } else {
            alert("Please Enter an input")
        }


    });


}



function loadRequest() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            let dbref = firebase.database().ref("requests")
            let user = firebase.auth().currentUser;
            let usertoken = user.uid;

            dbref.child(usertoken).on('value', function(snapshot) {
                let data = snapshot.val();
                $("table #tbl").remove();
                for (prop in data) {
                    let markup = "<tr id = 'tbl'><td>" + data[prop]['equipment'] + "</td><td>" + data[prop]['description'] + "</td><td>" + data[prop]['details'] + "</td><td>" + data[prop]['date'] + "</td><td>" + data[prop]['status'] + "</td><td>" + data[prop]['comment'] + "</td></tr>";
                    $("table").append(markup);



                }
            });
        }
    });

}


function loadNotification() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            let dbref = firebase.database().ref("notifications")
            let user = firebase.auth().currentUser;
            let usertoken = user.uid;

            dbref.child(usertoken).on('value', function(snapshot) {
                let data = snapshot.val();
                for (prop in data) {
                    let markup = "<p> " + data[prop]["Message"] + "</p>"
                    $("#notify").append(markup);



                }
            });
        }
    })

}

loadNotification();




function createRequest() {
    let equip = $("#equpid").val()
    let describe = $("#description").val()
    let detail = $("#detail").val()
    let depart = $("#department").val()
    let d = new Date;

    if (equip != "" && describe != "" && detail != "" && depart != "") {
        let today = d.getFullYear() + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2);
        let dbref = firebase.database().ref("requests")
        let user = firebase.auth().currentUser;
        let userId = user.uid;
        let dbkey = dbref.child(userId).push().key;
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
    } else {
        alert("One of the input is empty.")
    }


}


function adminloadRequest() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let dbref = firebase.database().ref("requests")
            dbref.on('value', function(snapshot) {
                let data = snapshot.val();
                // console.log(snapshot.val());
                for (prop in data) {
                    ndata = data[prop]
                    for (nprop in ndata) {
                        //console.log(ndata.key())
                        let nkey = ndata[nprop]['akey']
                        let ukey = ndata[nprop]['userid']
                        let markup = "<tr id = 'tbl'><td>" + ndata[nprop]['equipment'] + "</td><td>" + ndata[nprop]['description'] + "</td><td>" + ndata[nprop]['details'] + "</td><td>" + ndata[nprop]['date'] + "</td><td>" + ndata[nprop]['status'] + "</td><td>" + ndata[nprop]['comment'] + "</td><td>" + ndata[nprop]['department'] + "</td></tr>";
                        let markup2 = '<td><button id = "approve" class = "action" onclick = "approve(\'' + nkey + '\',\'' + ukey + '\')"> Approve</button><br><br></td>'
                        let markup3 = '<td><button id = "reject" class = "action" onclick = "reject(\'' + nkey + '\',\'' + ukey + '\')"> Reject</button><br><br></td>'
                        let markup4 = '<td>Name: &nbsp&nbsp <input type = "text" class = "repairname" placeholder = "Input the name of repairer"><br> <br>Phone No: <input type = "text" class = "repairnum" placeholder = "Phone Number"><button class = "action assign" onclick = "addRepair(\'' + nkey + '\',\'' + ukey + '\')">Add Repairer</button><br><br></td>'
                        let markup5 = '<td><textarea placeholder = "Add Comment" class = "commentbox"></textarea><br><br><button class = "comment action" onclick = "comment(\'' + nkey + '\',\'' + ukey + '\')"> Add Comment</button><br><br></td></tr>'
                        let markup6 = '<td><button id = "resolve" class = "action" onclick = "resolve(\'' + nkey + '\',\'' + ukey + '\')"> Click if Resolved</button><br><br></td>'
                        //let markup6 = "<input type = 'hidden' value = n
                        let markupi;

                        if (ndata[nprop]['approved'] == "true") {
                            markupi = markup4 + markup5
                        } else if (ndata[nprop]['reject'] == "true") {
                            markupi = markup5
                        } else {
                            markupi = markup2 + markup3
                        }

                        if (ndata[nprop]['comment'] != "none") {
                            markupi = markup4
                        }

                        if (ndata[nprop]['comment'] != "none" && ndata[nprop]['assigned'] != "none") {
                            markupi = markup6
                        }

                        if (ndata[nprop]['comment'] == "none" && ndata[nprop]['assigned'] != "none") {
                            markupi = markup5
                        }

                        if (ndata[nprop]['reject'] == "true" && ndata[nprop]['comment'] != "none") {
                            markupi = ""
                        }

                        if (ndata[nprop]['resolve'] == "true") {
                            markupi = ""
                        }

                        $("table").append(markup, markupi);
                    }

                }
            });
        }
    })



}

function approve(akey, usertoken) {

    firebase.database().ref('requests').child(usertoken).child(akey).on('value', function(snapshot) {
        let reqdetail = snapshot.val();
        let reqname = reqdetail["equipment"]
        let reqdate = reqdetail["date"]


        firebase.database().ref("notify").set({
            notify: 1
        })


        firebase.database().ref("requests").child(usertoken).child(akey).update({
            status: "approved",
            approved: "true"
        })

        firebase.database().ref("notifications").child(usertoken).push({
            Message: "Your Request on " + reqdate + " about " + reqname + " have been Appproved"
        })
    location.reload()
    });
    
}




function reject(akey, usertoken) {

    firebase.database().ref('requests').child(usertoken).child(akey).on('value', function(snapshot) {
        let reqdetail = snapshot.val();
        let reqname = reqdetail["equipment"]
        let reqdate = reqdetail["date"]

        firebase.database().ref("notify").set({
            notify: 1
        })

        firebase.database().ref("notifications").child(usertoken).push({
            Message: "Your Request on " + reqdate + " about " + reqname + " have been Rejected"
        })

        firebase.database().ref("requests").child(usertoken).child(akey).update({
            status: "rejected",
            reject: "true"
        });
    location.reload()
    });
    
}

function resolve(akey, usertoken) {
    firebase.database().ref("requests").child(usertoken).child(akey).update({
        status: "Resolved",
        resolve: "true"
    })
    location.reload()
}




function admin() {
    $("#adminwelcome").show();
    $("#adminmenu").show();
    $("#staffwelcome").hide();
    $("#staffmenu").hide();
    $("#admincon").show();
    $("#adminmenu1").show();
}


function staff() {
    $("#adminwelcome").hide();
    $("#adminmenu").hide();
    $("#staffwelcome").show();
    $("#staffmenu").show();
    $("#staffcon").show();
    $("#staffmenu1").show();

}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(userId).once('value').then(function(snapshot) {
            let userdetail = snapshot.val();
            let fullname = userdetail["Fullname"];
            let username = userdetail["Username"];
            let level = userdetail["level"];
            if (level == 2) {
                admin()
                adminloadRequest()
            } else {
                staff()
                loadRequest()
            }

        });

    } else {
        window.location = "/"
    }

});




function fileUpload() {
    let file = document.getElementById("file").files[0]
    console.log(file)
    let fileName = file.name;
    console.log(file)
    let storageRef = firebase.storage().ref("images");
    let spaceRef = storageRef.child(fileName);
    let uploadTask = spaceRef.put(file);
    document.getElementById("file").value = "";
    alert("Your file have been uploaded");
}