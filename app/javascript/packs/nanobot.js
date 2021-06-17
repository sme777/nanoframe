$(document).ready(function() {
    $('#synthesizer-shape').click(function() {
        let synthesizerChoice = $('#synthesizer-shape').find(":selected").text();
    
        if (synthesizerChoice == "Cube") {
            $(".width-input").prop("disabled", true);
            $(".length-input").prop("disabled", true);
            $(".dimension-text").text("Choose Cube dimension in nanometers (nm)");
            $(".dimension-text").css({"display" : "block"});
        } else if (synthesizerChoice == "Prism") {
    
        } else if (synthesizerChoice == "Tetrahedron") {
    
        }
    });

    $('.height-input').on('input', function() {
        let heightVal = $('.height-input').val();
        $(".width-input").val(heightVal);
        $(".length-input").val(heightVal);
    });

});