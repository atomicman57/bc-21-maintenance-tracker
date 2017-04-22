firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location = "/dashboard"

        console.log(firebase.auth().currentUser)
    } else {

    }
});


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