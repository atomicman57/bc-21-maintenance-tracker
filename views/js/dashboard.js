/**
 * Load Notification Function.
 * This function load the notification of the staff from database
 * It get the current user with firebase function currentUser
 * It add the notification to html id name with "notify"
 * It is then called after to load notification for the current User
 * This function is for only staff
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
          let notificationMessage = "<p> " + data[prop]["Message"] + "</p>"
          $("#notify").append(notificationMessage);



        }
      });
    }
  })

}

loadNotification();


/**
 * Admin Function
 *
 * @param {string} The username of the admin
 * @param {boolean} If the admin email is verified or not
 * It shows the admin menu and verification  notification
 * It shows admin welcome message
 * It hide all staff menu
 */

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

/**
 * Staff Function
 *
 * @param {string} The username of the admin
 * @param {boolean} If the staff email is verified or not
 * It shows the staff menu and verification notification
 * It shows staff welcome message
 * It hide all admin menu
 */

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

/**
 * This function is to check the type of user
 * If the level is 1 then that is a staff
 * If level is two that is admin
 * It then call the proper function for the user
 * If user is not signed in, it returns to the home page
 */

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    let verified = firebase.auth().currentUser.emailVerified;
    let userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users').child(userId).once('value').then(function(snapshot) {
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


/**
 * This is to notify the user of new notification request
 */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    let userId = firebase.auth().currentUser.uid;
    firebase.database().ref('notify').child(userId).on('value', function(snapshot) {
      var detail = snapshot.val();
      var notif = detail["notify"]
      if (notif == 1) {
        $("#notiff").html("<font color = 'red'>(NEW)</font>")
      } else {
        $("#notiff").html(" ")
      }
    })
  } else {
    window.location = "/"
  }
});




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
    // User is signed in.
    var uid = user.uid;
  } else {
    window.location = "/"
  }
});