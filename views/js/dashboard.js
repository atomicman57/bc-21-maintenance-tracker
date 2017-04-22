function loadnotif() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            var dbref = firebase.database().ref("notifications")
            var user = firebase.auth().currentUser;
            var usertoken = user.uid;

            dbref.child(usertoken).on('value', function (snapshot) {
                var data = snapshot.val();
                for (prop in data) {
                    var markup = "<p> " + data[prop]["Message"] + "</p>"
                    $("#notify").append(markup);



                }
            });
        }
    })

}

loadnotif();

function admin(user, verified) {
    $("#adminwelcome").show();
    $("#adminmenu").show();
    $("#staffwelcome").hide();
    $("#staffmenu").hide();
    $("#adminmenu1").show();
    $("span#user").html(user);
    if (!verified) {
        $("#adminwelcome").html("<font size = '13' color = 'red'>Your Account have not been verified, Login to your email to verify your Account.</font>");
    }

}


function staff(user, verified) {
    $("#adminwelcome").hide();
    $("#adminmenu").hide();
    $("#staffwelcome").show();
    $("#staffmenu").show();
    $("#staffmenu1").show();
    $("span#user").html(user);
    if (!verified) {
        $("#staffwelcome").html("<font size = '13' color = 'red'>Your Account have not been verified, Login to your email to verify your Account.</font>");
    }

}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var verified = firebase.auth().currentUser.emailVerified;
        console.log(verified)
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(userId).once('value').then(function (snapshot) {
            var userdetail = snapshot.val();
            var fullname = userdetail["Fullname"];
            var username = userdetail["Username"];
            var level = userdetail["level"];
            if (level == 2) {
                admin(username, verified)
            } else {
                staff(username, verified)
            }

        });

    } else {
        window.location = "/"
    }

});