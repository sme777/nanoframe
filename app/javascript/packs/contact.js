$(document).ready(function() {

    $("#contact-btn").click(function(e) {
        e.preventDefault();
        $(".email-input-form").css({"opacity": "0.5"});
        $(".dna-mascot-container").css({"opacity": "0.5"});
        $(".email-confirm-container").css({"display": "block"});
    });

    $(".close-btn").click(function(e) {
        $(".email-input-form").css({"opacity": "1"});
        $(".dna-mascot-container").css({"opacity": "1"});
        $(".email-confirm-container").css({"display": "none"});

        $("#fullNameInput").val("");
        $("#emailInput").val("");
        $("#messageInput").val("");

        $(".contact-form").submit();
    });

    
});