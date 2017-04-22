function hideSignup() {
    $("#signupform").hide();
}

function verifyMsg() {
    let msg = "Your Registration on E-MTracker was successful, "
    let msg2 = "A verification mail have been sent to you, "
    let msg3 = "check your mail to verify your account. Click Sign inand you will be automatically signed in"
    $("#verifiy").append(msg + msg2 + msg3);
}


function signUp() {
    let Email = document.getElementById("email")
    let Password = document.getElementById("password")
    let fullName = document.getElementById("fullName").value
    let username = document.getElementById("username").value
    let email = Email.value;
    let password = Password.value;
    let handleerror = "";
    if (email.length > 5 && password.length > 3 && fullName.length > 5 && username.length > 4) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (value) {
            firebase.auth().onAuthStateChanged(function (user) {
                user.sendEmailVerification();
                // if signup is sucessful hide signup
                let uid = user.uid
                hideSignup()
                verifyMsg()
                firebase.database().ref('users').child(uid).set({
                    Fullname: fullName,
                    Username: username,
                    level: 1
                });


            });

        }).catch(function (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage)
        });




    } else {

        alert("Errors was detected in your input - Your Password Length must be atleast 4,Full Name length must be atleast 6 and username length must be atleast 5")
    }

}