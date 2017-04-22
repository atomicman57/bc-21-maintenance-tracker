function hidesignup() {
    $("#signupform").hide();
}

function verifymsg() {
    var msg = "Your Registration on E-MTracker was successful, "
    var msg2 = "A verification mail have been sent to you, "
    var msg3 = "check your mail to verify your account. Click Sign inand you will be automatically signed in"
    $("#verifiy").append(msg + msg2 + msg3);
}


function signup() {
    var Email = document.getElementById("email")
    var Password = document.getElementById("password")
    var fullName = document.getElementById("fullName").value
    var username = document.getElementById("username").value
    var email = Email.value;
    var password = Password.value;
    var handleerror = "";
    if (email.length > 5 && password.length > 3 && fullName.length > 5 && username.length > 4) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (value) {
            firebase.auth().onAuthStateChanged(function (user) {
                user.sendEmailVerification();
                // if signup is sucessful hide signup
                var uid = user.uid
                hidesignup()
                verifymsg()
                firebase.database().ref('users').child(uid).set({
                    Fullname: fullName,
                    Username: username,
                    level: 1
                });


            });

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });




    } else {

        alert("Errors was detected in your input - Your Password Length must be atleast 4,Full Name length must be atleast 6 and username length must be atleast 5")
    }

}