firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location = "/dashboard"

        console.log(firebase.auth().currentUser)
    } else {

    }
});


function signin() {
    var Email = document.getElementById("email")
    var Password = document.getElementById("password")
    var email = Email.value;
    var password = Password.value;

    if (email.length > 5 && password.length > 3) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
            // ...
        });

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                window.location = "/dashboard"
                console.log(firebase.auth().currentUser)
            } else {}
        });

    } else {

        alert("Invalid Email or Password")
    }


}