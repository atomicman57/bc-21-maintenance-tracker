/**
 * Firebase function to if user is signed in.
 * If user is signned in successfully, redirect to dashboard
 */

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location = "/dashboard"

        console.log(firebase.auth().currentUser)
    } else {

    }
});


/**
 * Sign in in function.
 * It get the value of email and password from user
 * It then use the firebase sign in function to sign user in
 * It also alert errors if there is any.
 * The Email length must be greater than 5
 * Password length must be greater than 3
 * If user is signed in, it will redirect to dashboard
 */


function signIn() {
    let Email = document.getElementById("email")
    let Password = document.getElementById("password")
    let email = Email.value;
    let password = Password.value;

    if (email.length > 5 && password.length > 3) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage)
            // ...
        });

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                window.location = "/dashboard"
            } else {}
        });

    } else {

        alert("Invalid Email or Password")
    }


}