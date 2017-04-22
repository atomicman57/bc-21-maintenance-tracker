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
 * The html page can only be view if user is signed in
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
 * it stores the comment in the database reference "requests"
 * It checks if the "Add Comment Button" with html class "comment" is clicked
 * It gets the comment from the textarea of html of the page
 * It also handles error, if the user does not enter any input
 */

function comment(usertoken, akey) {

    $(document).on('click', '.comment', function() {

        let comments = $(this).prevAll("textarea").val();
        if (comments != "") {
            firebase.database().ref("requests").child(akey).child(usertoken).update({
                comment: comments
            });
            location.reload()
        } else {
            alert("Please Enter an input")
        }


    });

}


/**
 * Add repairer Function
 * Only admin have access to this function
 * @param {string} The user id of the staff that make the request 
 * @param {string} The id/key of the request on firebase database
 * it stores the repairer name and phone number in the database reference "requests"
 * It checks if the "Add Repairer" button with html class "assign" is clicked
 * It gets the inputs from the input textboxs of html of the page
 * It also handles error, if the user does not enter any input
 * It then change the "assigned"(assign status) of the request to "true"
 */

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



/**
 * Load Request Function
 * Only the staff have access to this function.
 * it load the requests of staff logged in from the database reference "requests"
 * It get the user id and load all request on that user id
 * It then add it to the html table
 */

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
                    let datas = "<tr id = 'tbl'><td>" + data[prop]['equipment'] + "</td><td>" + data[prop]['description'] + "</td><td>" + data[prop]['details'] + "</td><td>" + data[prop]['date'] + "</td><td>" + data[prop]['status'] + "</td><td>" + data[prop]['comment'] + "</td></tr>";
                    $("table").append(datas);



                }
            });
        }
    });

}




/**
 * Load Notification Function.
 * This function load the notification of the staff from database
 * It get the current user with firebase function currentUser
 * It add the notification to html id name with "notify"
 * It is then called after to load notification for the current User
 * This function only for staffs
 */

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



/**
 * Create Request Function.
 * This function create a request and save it on the firebase database with refrence "requests"
 * It gets the user input with the id using jquery .val
 * It get the current date with Js Date object
 * It checks if there is an input in the input textbox
 * If there is no input it alert an error
 * It is also alert if the request creation was succesful
 * This function is for only staff
 */


function createRequest() {
    let equipmentNo = $("#equpid").val()
    let descriptionOfEquipment = $("#description").val()
    let detail = $("#detail").val()
    let departmentOfStaff = $("#department").val()
    let date = new Date;

    if (equipmentNo != "" && descriptionOfEquipment != "" && detail != "" && departmentOfStaff != "") {
        let today = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
        let dbref = firebase.database().ref("requests")
        let user = firebase.auth().currentUser;
        let userId = user.uid;
        let dbkey = dbref.child(userId).push().key;
        dbref.child(userId).child(dbkey).update({
            equipment: equipmentNo,
            description: descriptionOfEquipment,
            details: detail,
            date: today,
            status: "pending",
            comment: "none",
            department: departmentOfStaff,
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


/**
 * Admin Load Request Function.
 * This function load all the staff requests make from database
 * It loops through each data in the firebase database with reference "requests"
 * It dynamically generate the html buttons and tables for the requests.
 * And append it to a table
 * Buttons generated include : Approve, Reject, Resolved, Add comment, Add repairer
 * It generate textarea and input textbox for each request too
 * It checks if the request is approved, reject or resolved.
 * If the request was approved, it will hide both approve and reject buttons and show add comment and add repairer buttons
 * If the request was rejected, it will hide both approve and reject buttons and show add comment only.
 * If comment is added, it hide the comment button and textarea.
 * If repairer is added, it hide the add repairer button and input textbox and show resolved button.
 * if the request is resolved, it will ide the button and it will not display any othe button
 * Each button generated has a function it calls e.g Approve buttons calls approve function and pass an argument
 * This function is for Admin only
 */

function adminloadRequest() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let dbref = firebase.database().ref("requests")
            dbref.on('value', function(snapshot) {
                let data = snapshot.val();
    
                for (prop in data) {
                    ndata = data[prop]
                    for (nprop in ndata) {
                        
                        let nkey = ndata[nprop]['akey']
                        let ukey = ndata[nprop]['userid']
                        let generatedTable = "<tr id = 'tbl'><td>" + ndata[nprop]['equipment'] + "</td><td>" + ndata[nprop]['description'] + "</td><td>" + ndata[nprop]['details'] + "</td><td>" + ndata[nprop]['date'] + "</td><td>" + ndata[nprop]['status'] + "</td><td>" + ndata[nprop]['comment'] + "</td><td>" + ndata[nprop]['department'] + "</td></tr>";
                        let approvedButton = '<td><button id = "approve" class = "action" onclick = "approve(\'' + nkey + '\',\'' + ukey + '\')"> Approve</button><br><br></td>'
                        let RejectButton = '<td><button id = "reject" class = "action" onclick = "reject(\'' + nkey + '\',\'' + ukey + '\')"> Reject</button><br><br></td>'
                        let addRepairerButton = '<td>Name: &nbsp&nbsp <input type = "text" class = "repairname" placeholder = "Input the name of repairer"><br> <br>Phone No: <input type = "text" class = "repairnum" placeholder = "Phone Number"><button class = "action assign" onclick = "addRepair(\'' + nkey + '\',\'' + ukey + '\')">Add Repairer</button><br><br></td>'
                        let addCommentButton = '<td><textarea placeholder = "Add Comment" class = "commentbox"></textarea><br><br><button class = "comment action" onclick = "comment(\'' + nkey + '\',\'' + ukey + '\')"> Add Comment</button><br><br></td></tr>'
                        let resolveButton = '<td><button id = "resolve" class = "action" onclick = "resolve(\'' + nkey + '\',\'' + ukey + '\')"> Click if Resolved</button><br><br></td>'
                        
                        let generatedButtons;

                        if (ndata[nprop]['approved'] == "true") {
                            generatedButtons = addRepairerButton + addCommentButton
                        } else if (ndata[nprop]['reject'] == "true") {
                            generatedButtons = addCommentButton
                        } else {
                            generatedButtons = approvedButton + RejectButton
                        }

                        if (ndata[nprop]['comment'] != "none") {
                            generatedButtons = addRepairerButton
                        }

                        if (ndata[nprop]['comment'] != "none" && ndata[nprop]['assigned'] != "none") {
                            generatedButtons = resolveButton
                        }

                        if (ndata[nprop]['comment'] == "none" && ndata[nprop]['assigned'] != "none") {
                            generatedButtons = addCommentButton
                        }

                        if (ndata[nprop]['reject'] == "true" && ndata[nprop]['comment'] != "none") {
                            generatedButtons = ""
                        }

                        if (ndata[nprop]['resolve'] == "true") {
                            generatedButtons = ""
                        }

                        $("table").append(generatedTable, generatedButtons);
                    }

                }
            });
        }
    })
}


/**
 * Approve Function.
 * @param {string} The firebase key for that particular request 
 * @param {string} The user id 
 * This function approve the request of the staff, It is called by approved button in the generated button
 * This function update the request firebase database "status" with "approved" and approved with "true".
 * It also notify the user of the approval
 * It reloads the page to show changes
 * This function is for Admin only
 */


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


/**
 * Reject Function.
 * @param {string} The firebase key for that particular request 
 * @param {string} The user id 
 * This function reject the request of the staff, It is called by reject button in the generated button
 * This function update the request firebase database "status" with "rejected" and "reject" with "true"
 * It also notify the user of the rejection
 * It reloads the page to show changes
 * This function is for Admin only
 */

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


/**
 * Resolve Function.
 * @param {string} The firebase key for that particular request 
 * @param {string} The user id 
 * This function resolves the request of the staff, It is called by resolve button in the generated button
 * This function update the request firebase database "status" with "resolved".
 * It reloads the page to show changes
 * This function is for Admin only
 */

function resolve(akey, usertoken) {
    firebase.database().ref("requests").child(usertoken).child(akey).update({
        status: "Resolved",
        resolve: "true"
    })
    location.reload()
}


/**
 * Admin Function
 *
 * @param {string} The username of the admin 
 * @param {boolean} If the admin email is verified or not
 * It shows the admin menu and verification  notification
 * It shows admin welcome message
 * It hide all staff menu
 */


function admin() {
    $("#adminwelcome").show();
    $("#adminmenu").show();
    $("#staffwelcome").hide();
    $("#staffmenu").hide();
    $("#admincon").show();
    $("#adminmenu1").show();
}


/**
 * Staff Function
 *
 * @param {string} The username of the admin 
 * @param {boolean} If the staff email is verified or not 
 * It shows the staff menu and verification notification
 * It shows staff welcome message
 * It hide all admin menu
 */


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