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
            $(".ws-container").show();
            $(".hs-container").show();
            $(".ds-container").show();

            $(".radius-container").hide();
            $(".rs-container").hide();
            $(".rt-container").hide();
            $(".rb-container").hide();
            $(".detail-container").hide();
            $(".tube-container").hide();
            $(".tubular-container").hide();
            $(".p-container").hide();
            $(".q-container").hide();
            requiredParams.push(".height-input");
            requiredParams.push(".width-input");
            requiredParams.push(".depth-input");
            requiredParams.push(".ws-input");
            requiredParams.push(".hs-input");
            requiredParams.push(".ds-input");

            // change placeholders
            $(".width-input").attr("placeholder", "30 nm")
            $(".height-input").attr("placeholder", "30 nm")
            $(".depth-input").attr("placeholder", "30 nm")

            $(".ws-input").attr("placeholder", "3")
            $(".hs-input").attr("placeholder", "3")
            $(".ds-input").attr("placeholder", "3")

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
            $(".ds-container").hide();
            requiredParams.push(".ws-input");
            requiredParams.push(".hs-input");
            requiredParams.push(".radius-input");

            // change placeholders
            $(".ws-input").attr("placeholder", "10")
            $(".hs-input").attr("placeholder", "8")
            $(".radius-input").attr("placeholder", "22 nm")

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
            $(".ds-container").hide();

            requiredParams.push(".rs-input");
            requiredParams.push(".rst-input");
            requiredParams.push(".rsb-input");
            requiredParams.push(".height-input");

            // change placeholders
            $(".rs-input").attr("placeholder", "12")
            $(".rst-input").attr("placeholder", "18 nm")
            $(".rsb-input").attr("placeholder", "10 nm")
            $(".height-input").attr("placeholder", "33 nm")

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
            $(".ds-container").hide();

            requiredParams.push(".rs-input");
            requiredParams.push(".radius-input");
            requiredParams.push(".height-input");

            // change placeholders
            $(".radius-input").attr("placeholder", "20 nm")
            $(".rs-input").attr("placeholder", "20")
            $(".height-input").attr("placeholder", "33 nm")

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
            $(".ds-container").hide();
            requiredParams.push(".radius-input");
            requiredParams.push(".detail-input");

            // change placeholders
            $(".radius-input").attr("placeholder", "22 nm")
            $(".detail-input").attr("placeholder", "0")
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
            $(".ds-container").hide();
            requiredParams.push(".radius-input");
            requiredParams.push(".tube-input");
            requiredParams.push(".rs-input");
            requiredParams.push(".tubular-input");

            // change placeholders
            $(".radius-input").attr("placeholder", "22 nm")
            $(".rs-input").attr("placeholder", "8")
            $(".tube-input").attr("placeholder", "2 nm")
            $(".tubular-input").attr("placeholder", "24")
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
            $(".ds-container").hide();
            requiredParams.push(".radius-input");
            requiredParams.push(".tube-input");
            requiredParams.push(".rs-input");
            requiredParams.push(".tubular-input");
            requiredParams.push(".p-input");
            requiredParams.push(".q-input");

            // change placeholders
            $(".radius-input").attr("placeholder", "15 nm")
            $(".rs-input").attr("placeholder", "8")
            $(".tube-input").attr("placeholder", "4 nm")
            $(".tubular-input").attr("placeholder", "64")
            $(".p-input").attr("placeholder", "2")
            $(".q-input").attr("placeholder", "3")
        } else if (synthesizerChoice == "Custom"){
            window.location = $(this).val();
            // hide everything
            // $(".radius-container").hide();
            // $(".detail-container").hide();
            // $(".rs-container").hide();
            // $(".height-container").hide();
            // $(".rt-container").hide();
            // $(".rb-container").hide();
            // $(".ws-container").hide();
            // $(".hs-container").hide()
            // $(".width-container").hide();
            // $(".depth-container").hide();
            // $(".tube-container").hide();
            // $(".tubular-container").hide();
            // $(".ds-container").hide();
        }
    });

});

$(document).ready(function() {

    $(".height-input").on("input", function(evt) {
        let self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
        {
          evt.preventDefault();
        } 

        if ($('#synthesizer-shape').find(":selected").text() == "Cube") {
            $(".width-input").val(self.val());
            $(".depth-input").val(self.val());
        }
        checkIfDone();
      });

      $(".width-input").on("input", function(evt) {
        let self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
        {
          evt.preventDefault();
        } 

        if ($('#synthesizer-shape').find(":selected").text() == "Cube") {
            $(".height-input").val(self.val());
            $(".depth-input").val(self.val());
        }
        checkIfDone();
      });

      $(".depth-input").on("input", function(evt) {
        let self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
        {
          evt.preventDefault();
        } 
        if ($('#synthesizer-shape').find(":selected").text() == "Cube") {
            $(".width-input").val(self.val());
            $(".height-input").val(self.val());
        }
        checkIfDone();
      });

      $(".ws-input").on("input", function(evt) {
        let self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
        {
          evt.preventDefault();
        } 
        checkIfDone();
      });

      $(".hs-input").on("input", function(evt) {
        let self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ''));
        if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
        {
          evt.preventDefault();
        } 
        checkIfDone();
      });

      $(".ds-input").on("input", function(evt) {
        let self = $(this);
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
    $(".input-container").click(function() {
        $("#sequenceCheckbox").prop("checked", false)
    })

    $(".random-sequence-container").click(function() {
      $("#sequenceUpload").val('')
    })
})

