function loadNotification() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            let dbref = firebase.database().ref("notifications")
            let user = firebase.auth().currentUser;
            let usertoken = user.uid;

            dbref.child(usertoken).on('value', function (snapshot) {
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
        let verified = firebase.auth().currentUser.emailVerified;
        let userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(userId).once('value').then(function (snapshot) {
            let userdetail = snapshot.val();
            let fullname = userdetail["Fullname"];
            let username = userdetail["Username"];
            let level = userdetail["level"];
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