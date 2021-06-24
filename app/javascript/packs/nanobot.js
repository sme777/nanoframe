$(document).ready(function() {
    $('#synthesizer-shape').val(0);

    $('#synthesizer-shape').click(function() {
        let synthesizerChoice = $('#synthesizer-shape').find(":selected").text();
    
        if (synthesizerChoice == "Cube") {
            // show neccsary input fields
            $(".height-container").show();
            $(".width-container").show();
            $(".depth-container").show();
            // hide unneccsary input fields
            $(".radius-container").hide();
            $(".rs-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".detail-container").hide();
            $(".ws-container").hide();
            $(".hs-container").hide()
        } else if (synthesizerChoice == "Sphere") {
            // show neccsary input fields
            $(".ws-container").show();
            $(".hs-container").show()
            $(".radius-container").show();

            // hide unneccsary input fields
            $(".height-container").hide();
            $(".width-container").hide();
            $(".depth-container").hide();
            $(".rs-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".detail-container").hide();

        } else if (synthesizerChoice == "Cylinder") {
            // show neccsary input fields
            $(".rs-container").show();
            $(".rt-container").show();
            $(".rb-container").show();
            $(".height-container").show();
            // hide unneccsary input fields
            $(".ws-container").hide();
            $(".hs-container").hide()
            $(".radius-container").hide();
            $(".width-container").hide();
            $(".depth-container").hide();
            $(".detail-container").hide();
        } else if (synthesizerChoice == "Cone") {
            // show neccsary input fields
            $(".rs-container").show();
            $(".height-container").show();
            $(".radius-container").show();
             // hide unneccsary input fields
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".ws-container").hide();
            $(".hs-container").hide()
            $(".width-container").hide();
            $(".depth-container").hide();
            $(".detail-container").hide();
        } else if (synthesizerChoice == "Polyhedron" || synthesizerChoice == "Tetrahedron" 
        || synthesizerChoice == "Octahedron" || synthesizerChoice == "Icosahedron" 
        || synthesizerChoice == "Dodecahedron") {
            // show neccsary input fields
            $(".radius-container").show();
            $(".detail-container").show();
            // hide unneccsary input fields
            $(".rs-container").hide();
            $(".height-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".ws-container").hide();
            $(".hs-container").hide()
            $(".width-container").hide();
            $(".depth-container").hide();
        } else {
            // hide everything
            $(".radius-container").hide();
            $(".detail-container").hide();
            $(".rs-container").hide();
            $(".height-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".ws-container").hide();
            $(".hs-container").hide()
            $(".width-container").hide();
            $(".depth-container").hide();
        }
    });

});