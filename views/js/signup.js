/**
 * Hide Sign up
 * This function hide the sign up form after succesful submission 
 */

function hideSignup() {
    $("#signupform").hide();
}


/**
 * Verification Message
 *This function tells the user if the registration was successful
 * And also tells the user to verify thier account on their mail
 * It append the message to an html element with id "verify"
 */


function verifyMsg() {
    let msg = "Your Registration on E-MTracker was successful, "
    let msg2 = "A verification mail have been sent to you, "
    let msg3 = "check your mail to verify your account. Click Sign inand you will be automatically signed in"
    $("#verifiy").append(msg + msg2 + msg3);
}



/**
 * Sign up Function
 * This is the main sign up function
 * It gets the user inputted information from the form
 * It use the firebase create user with email and password to create user
 * It then store the rest of the information on the database with firebase user id
 * It alert user of any errors that occurs
 */

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