let requiredParams = [];
//let paramMap = new Map();

$(document).ready(function() {
    $('#synthesizer-shape').val(0)
    $(".synthesizer-btn").prop("disabled", true);

    $('#synthesizer-shape').click(function() {
        let synthesizerChoice = $('#synthesizer-shape').find(":selected").text();
       
        $(".dimension-input").val("");

        if (synthesizerChoice == "Cube") {
            // show neccsary input fields
            requiredParams = [];
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
            $(".hs-container").hide();
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
            requiredParams.push(".height-input");
            requiredParams.push(".width-input");
            requiredParams.push(".depth-input");
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
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
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
        } else if (synthesizerChoice == "Torus"){
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
        } else if (synthesizerChoice == "Torus Knot"){
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
        var self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
        {
          evt.preventDefault();
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

});
