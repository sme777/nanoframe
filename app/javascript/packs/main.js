// $(document).on("turbolinks:load", function() {
//     $('.dropdown-toggle').dropdown()
//     $(html).css("background-color: black;")
// var validate = false;

$(document).ready(function() {

    $("#signup-btn").click(function(e) {
        $(".sign-in-container").css({"opacity": "0.5"});
        $(".sign-up-outer-container").css({"display": "block"});
    });
    


    
    // let n = 0;
    // $(".sign-up-outer-container").mouseenter(function() {
    //     n = 0;
    // }).mouseleave(function() {
    //     n = 1;
    // });

    $(".close-btn").click(function(e) {
        $(".sign-up-outer-container").css({"display": "none"});
        $(".sign-in-container").css({"opacity": "1"});
        n = 0;
        //$("#signup-btn").click();
    });
    
    // $("html").click(function(e){ 
    //     if (n == 1 && $(".sign-up-outer-container").css("display") == "block") {
    //         $(".sign-up-outer-container").css({"display": "none"});
    //         $(".sign-in-container").css({"opacity": "1"});
    //         n = 0;
    //         //alert("clickoutside");
    //     }
    // });


});


// $(document).ready(function() {
//     $('#signupSubmit').click(function(e) {
//         //return true;
//         e.preventDefault();
//         var name = $("#nameField").val();
//         var email = $("#emailField").val();
//         var password = $("#passwordField").val();
//         var confirmation = $("#confirmField").val();

//         var name_is_valid = false;
//         var email_is_valid = false;
//         var password_is_valid = false;
//         var confirmation_is_valid = false;

//         if (name == "") {
//             $("#nameField").removeClass("is-valid");
//             $("#nameField").addClass("is-invalid");
//             name_is_valid = false;
//         } else if (name.includes(" ")){
//             $("#nameField").removeClass("is-invalid");
//             $("#nameField").addClass("is-valid");
//             name_is_valid = true;
//         } else {
//             $("#nameField").removeClass("is-valid");
//             $("#nameField").addClass("is-invalid");
//             name_is_valid = false;
//         }
        
//         if (email == "") {
//             $("#emailField").removeClass("is-valid");
//             $("#emailField").addClass("is-invalid");
//             email_is_valid = false;
//         } else if (validateEmail(email)){
//             $("#emailField").addClass("is-valid");
//             $("#emailField").removeClass("is-invalid");
//             email_is_valid = true;
//         } else {
//             $("#emailField").removeClass("is-valid");
//             $("#emailField").addClass("is-invalid");
//             email_is_valid = false;
//         }
        
//         if (password == "") {
//             $("#passwordField").removeClass("is-valid");
//             $("#passwordField").addClass("is-invalid");
//             password_is_valid = false;
//         } else if (password.length < 8) {
//             $("#passwordField").removeClass("is-valid");
//             $("#passwordField").addClass("is-invalid");
//             password_is_valid = false;
//         } else {
//             $("#passwordField").removeClass("is-invalid");
//             $("#passwordField").addClass("is-valid");
//             password_is_valid = true;
//         }
        
//         if (confirmation == "") {
//             $("#confirmField").removeClass("is-valid");
//             $("#confirmField").addClass("is-invalid");
//             confirmation_is_valid = false;
//         } else if (password != confirmation) {
//             $("#confirmField").removeClass("is-valid");
//             $("#confirmField").addClass("is-invalid");
//             confirmation_is_valid = false;
//         } else {
//             $("#confirmField").addClass("is-valid");
//             $("#confirmField").removeClass("is-invalid");
//             confirmation_is_valid = true;
//         }

//         if (name_is_valid && email_is_valid && password_is_valid && confirmation_is_valid) {
//             validate = true;
//             return true;
//         }
        
//     });
//   });

//   $(document).ready(function() {
//     $('#signupSubmit').click(function(e) {
//         if (validate) {
//             $("form").submit();
//         }
//     });
//   });


// function validateEmail(email) {
//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }