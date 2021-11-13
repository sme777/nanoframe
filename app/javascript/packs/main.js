// handles signup/signin
$(document).ready(function() {

    $("#signup-btn").click(function(e) {
        $(".sign-in-container").css({"opacity": "0.5"});
        $(".dna-wrapper").css({"opacity": "0.5"});
        $(".sign-up-outer-container").css({"display": "block"});
    });


    $(".close-btn").click(function(e) {
        $(".sign-up-outer-container").css({"display": "none"});
        $(".sign-in-container").css({"opacity": "1"});
        $(".dna-wrapper").css({"opacity": "1"});
        // remove left on text
        $("#signUpUsername").val("");
        $("#firstName").val("");
        $("#lastName").val("");
        $("#mailName").val("");
        $("#mailAddress").val("");
        $("#passwordField").val("");
        // remove validation symbols
        $("#signUpUsername").removeClass("is-valid");
        $("#signUpUsername").removeClass("is-invalid");
        $("#firstName").removeClass("is-valid");
        $("#firstName").removeClass("is-invalid");
        $("#lastName").removeClass("is-valid");
        $("#lastName").removeClass("is-invalid");
        $("#mailName").removeClass("is-valid");
        $("#mailName").removeClass("is-invalid");
        $("#mailAddress").removeClass("is-valid");
        $("#mailAddress").removeClass("is-invalid");
        $("#passwordField").removeClass("is-valid");
        $("#passwordField").removeClass("is-invalid");
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


$(document).ready(function() {
    $('#signUpSubmit').click(function(e) {
        //return true;
        e.preventDefault();
        let username = $("#signUpUsername").val();
        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let mailName = $("#mailName").val();
        let mailAddress = $("#mailAddress").val();
        let password = $("#passwordField").val();

        let email = mailName + "@" + mailAddress;
        
        let fname_is_valid = false;
        let lname_is_valid = false;
        let email_is_valid = false;
        let password_is_valid = false;
        let username_is_valid = false;
        //var confirmation_is_valid = false;

        if (!/^[a-zA-Z]*$/g.test(firstName) || firstName.length == 0) {
            $("#firstName").removeClass("is-valid");
            $("#firstName").addClass("is-invalid");
            fname_is_valid = false;
        } else {
            $("#firstName").removeClass("is-invalid");
            $("#firstName").addClass("is-valid");
            fname_is_valid = true;
        }

        if (!/^[a-zA-Z]*$/g.test(lastName) || lastName.length == 0) {
            $("#lastName").removeClass("is-valid");
            $("#lastName").addClass("is-invalid");
            lname_is_valid = false;
        } else {
            $("#lastName").removeClass("is-invalid");
            $("#lastName").addClass("is-valid");
            lname_is_valid = true;
        }

        if (password == "") {
            $("#passwordField").removeClass("is-valid");
            $("#passwordField").addClass("is-invalid");
            password_is_valid = false;
        } else if (password.length < 8) {
            $("#passwordField").removeClass("is-valid");
            $("#passwordField").addClass("is-invalid");
            password_is_valid = false;
        } else {
            $("#passwordField").removeClass("is-invalid");
            $("#passwordField").addClass("is-valid");
            password_is_valid = true;
        }

        if (username == "") {
            $("#signUpUsername").removeClass("is-valid");
            $("#signUpUsername").addClass("is-invalid");
            username_is_valid = false;
        } else {
            $.ajax({
                url: "/checkusername?username=" + username,
                dataType: "json",
                success: function(data) {
                    if (!data["username_exists"]) {
                        $("#signUpUsername").addClass("is-valid");
                        $("#signUpUsername").removeClass("is-invalid");
                        username_is_valid = true;

                        if (email == "") {
                            $("#mailAddress").removeClass("is-valid");
                            $("#mailAddress").addClass("is-invalid");
                            $("#mailName").removeClass("is-valid");
                            $("#mailName").addClass("is-invalid");
                        } else if (validateEmail(email)){
                            $.ajax({
                                url: "/checkemail?email=" + email,
                                dataType: "json",
                                success: function(data) {
                                    if (!data["email_exists"]) {
                                        $("#mailAddress").addClass("is-valid");
                                        $("#mailAddress").removeClass("is-invalid");
                                        $("#mailName").addClass("is-valid");
                                        $("#mailName").removeClass("is-invalid");
                                        email_is_valid = true;
                                        if (fname_is_valid && email_is_valid && lname_is_valid 
                                            && password_is_valid && username_is_valid) {
                                            $("#signUpForm").submit();
                                        }
                                    } else {
                                        $("#mailAddress").removeClass("is-valid");
                                        $("#mailAddress").addClass("is-invalid");
                                        $("#mailName").removeClass("is-valid");
                                        $("#mailName").addClass("is-invalid");
                                    }
                                } 
                            });
                        } else {
                            $("#mailAddress").removeClass("is-valid");
                            $("#mailAddress").addClass("is-invalid");
                            $("#mailName").removeClass("is-valid");
                            $("#mailName").addClass("is-invalid");
                        }
                    } else {
                        $("#signUpUsername").removeClass("is-valid");
                        $("#signUpUsername").addClass("is-invalid");
                    }
                } 
            });
        }
        
        if (email == "") {
            $("#mailAddress").removeClass("is-valid");
            $("#mailAddress").addClass("is-invalid");
            $("#mailName").removeClass("is-valid");
            $("#mailName").addClass("is-invalid");
            email_is_valid = false;
        } else if (validateEmail(email)){
            $.ajax({
                url: "/checkemail?email=" + email,
                dataType: "json",
                success: function(data) {
                    if (!data["email_exists"]) {
                        $("#mailAddress").addClass("is-valid");
                        $("#mailAddress").removeClass("is-invalid");
                        $("#mailName").addClass("is-valid");
                        $("#mailName").removeClass("is-invalid");
                        email_is_valid = true;

                        if (username == "") {
                            $("#signUpUsername").removeClass("is-valid");
                            $("#signUpUsername").addClass("is-invalid");
                        } else {
                            $.ajax({
                                url: "/checkusername?username=" + username,
                                dataType: "json",
                                success: function(data) {
                                    if (!data["username_exists"]) {
                                        $("#signUpUsername").addClass("is-valid");
                                        $("#signUpUsername").removeClass("is-invalid");
                                        username_is_valid = true;
                                        if (fname_is_valid && email_is_valid && lname_is_valid 
                                            && password_is_valid && username_is_valid) {
                                            $("#signUpForm").submit();
                                        }
                                    } else {
                                        $("#signUpUsername").removeClass("is-valid");
                                        $("#signUpUsername").addClass("is-invalid");
                                    }
                                } 
                            });
                        }
                    } else {
                        $("#mailAddress").removeClass("is-valid");
                        $("#mailAddress").addClass("is-invalid");
                        $("#mailName").removeClass("is-valid");
                        $("#mailName").addClass("is-invalid");
                    }
                } 
            });

        } else {
            $("#mailAddress").removeClass("is-valid");
            $("#mailAddress").addClass("is-invalid");
            $("#mailName").removeClass("is-valid");
            $("#mailName").addClass("is-invalid");
            email_is_valid = false;
        }
    });
  });

$(document).ready(function() {
    $('#radio-one').click(function() {
        //
     });

     $('#radio-two').click(function() {
        //alert("private selected"); 
     });

     $('#radio-three').click(function() {
        //alert("history selected"); 
     });
});

$(document).ready(function() {
    let img_width = $('.user-portrait').width();
    let img_height = $('.user-portrait').height();
    if (img_height > img_width) {
        $('.user-portrait').addClass("portrait")
    } else {
        $('.user-portrait').addClass("landscape");
    }
    //$('.user-portrait').css({'height':img_width+'px'});

    $('.user-portrait').bind('click', function (evt) { 
        $(".file-upload").click();
        let readURL = function(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
    
                reader.onload = function (e) {
                    $('.user-portrait').attr('src', e.target.result);
                }
        
                reader.readAsDataURL(input.files[0]);
            }
        }
        
    
        $(".file-upload").on('change', function(){
            readURL(this);
        });
        
    });
});

$(document).ready(function() {
    const googleSignIn = $("#google-auth-form")
    const githubSignIn = $("#github-auth-form")

    $("#google-button").click(() => {
        googleSignIn.submit()
    })

    $("#github-button").click(() => {
        githubSignIn.submit()
    })
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}