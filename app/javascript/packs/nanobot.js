let requiredParams = [];
//let paramMap = new Map();

$(document).ready(function() {
    $('#synthesizer-shape').val(0)
    $(".synthesizer-btn").prop("disabled", true);

    $('#synthesizer-shape').click(function() {
        let synthesizerChoice = $('#synthesizer-shape').find(":selected").text();
        $(".synthesizer-btn").prop("disabled", true);
        $(".dimension-input").val("");

        if (synthesizerChoice == "Cube") {
            // show neccsary input fields
            requiredParams = [];
            $(".height-container").show();
            $(".width-container").show();
            $(".depth-container").show();
            $(".width-input").prop("disabled", true);
            $(".depth-input").prop("disabled", true);
            // hide unneccsary input fields
            $(".radius-container").hide();
            $(".rs-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".detail-container").hide();
            $(".ws-container").hide();
            $(".hs-container").hide();
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
            requiredParams.push(".height-input");
            requiredParams.push(".width-input");
            requiredParams.push(".depth-input");
        } else if (synthesizerChoice == "Sphere") {
            requiredParams = [];
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
            requiredParams.push(".ws-input");
            requiredParams.push(".hs-input");
            requiredParams.push(".radius-input");
        } else if (synthesizerChoice == "Cylinder") {
            requiredParams = [];
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();

            requiredParams.push(".rs-input");
            requiredParams.push(".rst-input");
            requiredParams.push(".rsb-input");
            requiredParams.push(".height-input");
        } else if (synthesizerChoice == "Cone") {
            requiredParams = [];
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();

            requiredParams.push(".rs-input");
            requiredParams.push(".radius-input");
            requiredParams.push(".height-input");
        } else if (synthesizerChoice == "Polyhedron" || synthesizerChoice == "Tetrahedron" 
        || synthesizerChoice == "Octahedron" || synthesizerChoice == "Icosahedron" 
        || synthesizerChoice == "Dodecahedron") {
            requiredParams = [];
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
            requiredParams.push(".radius-input");
            requiredParams.push(".detail-input");
        } else if (synthesizerChoice == "Torus"){
            requiredParams = [];
            $(".radius-container").show();
            $(".tube-container").show();
            $(".rs-container").show();
            $(".tubular-container").show();

            $(".detail-container").hide();
            $(".height-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".ws-container").hide();
            $(".hs-container").hide()
            $(".width-container").hide();
            $(".depth-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
            requiredParams.push(".radius-input");
            requiredParams.push(".tube-input");
            requiredParams.push(".rs-input");
            requiredParams.push(".tubular-input");
        } else if (synthesizerChoice == "Torus Knot"){
            requiredParams = [];
            $(".radius-container").show();
            $(".tube-container").show();
            $(".rs-container").show();
            $(".tubular-container").show();
            $(".p-container").show();
            $(".q-container").show();
           
            $(".detail-container").hide();
            $(".height-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".ws-container").hide();
            $(".hs-container").hide()
            $(".width-container").hide();
            $(".depth-container").hide();
            requiredParams.push(".radius-input");
            requiredParams.push(".tube-input");
            requiredParams.push(".rs-input");
            requiredParams.push(".tubular-input");
            requiredParams.push(".p-input");
            requiredParams.push(".q-input");
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
        }
    });

});

$(document).ready(function() {

    $(".dimension-input").on("input", function(evt) {
        let self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
        {
          evt.preventDefault();
        } 

        if ($('#synthesizer-shape').find(":selected").text() == "Cube") {
            $(".width-input").val(self.val() + " nm");
            $(".depth-input").val(self.val() + " nm");
        }
        checkIfDone();
      });

    function checkIfDone() {
        $(".synthesizer-btn").prop("disabled", true);
        if (requiredParams == []) {
            return;
        }
        for (i = 0; i < requiredParams.length; i++) {
            if ($(requiredParams[i]).val() == "") {
                return;
            }
        }
        $(".synthesizer-btn").prop("disabled", false);

    }
});

$(document).ready(function() {
    $(".synthesizer-btn").click(function() {
        $(".generator-outer-container").css({"visibility": "visible"})
        $(".generator-download-container").css({"display": "block"});
        $('html, body').animate({
            scrollTop: $(".generator-outer-container").offset().top
        }, 2000);
    });
});
