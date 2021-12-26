let requiredParams = []

$(document).ready(function () {
  $('#synthesizer-shape').val(0)
  $(".synthesizer-btn").prop("disabled", true);
  const allInputs = ["height", "width", "depth", "ws", "hs", "ds", "radius",
    "rs", "rt", "rb", "detail", "tube", "tubular", "p", "q"
  ]

  $('#synthesizer-shape').click(function () {
    let synthesizerChoice = $('#synthesizer-shape').find(":selected").text();
    $(".synthesizer-btn").prop("disabled", true);
    $(".dimension-input").val("");

    if (synthesizerChoice == "Cube") {

      requiredParams = displayInputs("height", "width", "depth", "ws", "hs", "ds")
      // change placeholders
      $(".width-input").attr("placeholder", "30 nm")
      $(".height-input").attr("placeholder", "30 nm")
      $(".depth-input").attr("placeholder", "30 nm")

      $(".ws-input").attr("placeholder", "3")
      $(".hs-input").attr("placeholder", "3")
      $(".ds-input").attr("placeholder", "3")

    } else if (synthesizerChoice == "Sphere") {

      requiredParams = displayInputs("ws", "hs", "radius")
      // change placeholders
      $(".ws-input").attr("placeholder", "10")
      $(".hs-input").attr("placeholder", "8")
      $(".radius-input").attr("placeholder", "22 nm")

    } else if (synthesizerChoice == "Cylinder") {

      requiredParams = displayInputs("rs", "rt", "rb", "height")
      // change placeholders
      $(".rs-input").attr("placeholder", "12")
      $(".rst-input").attr("placeholder", "18 nm")
      $(".rsb-input").attr("placeholder", "10 nm")
      $(".height-input").attr("placeholder", "33 nm")

    } else if (synthesizerChoice == "Cone") {
      
      requiredParams = displayInputs("rs", "height", "radius")

      // change placeholders
      $(".radius-input").attr("placeholder", "20 nm")
      $(".rs-input").attr("placeholder", "20")
      $(".height-input").attr("placeholder", "33 nm")

    } else if (synthesizerChoice == "Polyhedron" || synthesizerChoice == "Tetrahedron" ||
      synthesizerChoice == "Octahedron" || synthesizerChoice == "Icosahedron" ||
      synthesizerChoice == "Dodecahedron") {

      requiredParams = displayInputs("radius", "detail")
      // change placeholders
      $(".radius-input").attr("placeholder", "22 nm")
      $(".detail-input").attr("placeholder", "0")
    } else if (synthesizerChoice == "Torus") {
    
      requiredParams = displayInputs("radius", "tube", "rs", "tubular")
      // change placeholders
      $(".radius-input").attr("placeholder", "22 nm")
      $(".rs-input").attr("placeholder", "8")
      $(".tube-input").attr("placeholder", "2 nm")
      $(".tubular-input").attr("placeholder", "24")
    } else if (synthesizerChoice == "Torus Knot") {
      requiredParams = displayInputs("radius", "tube", "rs", "tubular", "p", "q")
      // change placeholders
      $(".radius-input").attr("placeholder", "15 nm")
      $(".rs-input").attr("placeholder", "8")
      $(".tube-input").attr("placeholder", "4 nm")
      $(".tubular-input").attr("placeholder", "64")
      $(".p-input").attr("placeholder", "2")
      $(".q-input").attr("placeholder", "3")
    } else if (synthesizerChoice == "Custom") {
      window.location = $(this).val()
      displayInputs()
    }
  });

  function displayInputs(...args) {
    params = []
    for (let i = 0; i < allInputs.length; i++) {
      let input = allInputs[i]
      if (args.includes(input)) {
        $(`.${input}-container`).show()
        params.push(`.${input}-input`)
      } else {
        $(`.${input}-container`).hide()
      }
    }
    return params
  }

});

$(document).ready(function () {

  $(".height-input").on("input", function (evt) {
    let self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
      evt.preventDefault();
    }
    checkIfDone();
  });

  $(".width-input").on("input", function (evt) {
    let self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
      evt.preventDefault();
    }

    checkIfDone();
  });

  $(".depth-input").on("input", function (evt) {
    let self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
      evt.preventDefault();
    }
    checkIfDone();
  });

  $(".ws-input").on("input", function (evt) {
    let self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
      evt.preventDefault();
    }
    $(".hs-input").val(self.val())
    $(".ds-input").val(self.val())
    checkIfDone();
  });

  $(".hs-input").on("input", function (evt) {
    let self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
      evt.preventDefault();
    }
    $(".ws-input").val(self.val())
    $(".ds-input").val(self.val())
    checkIfDone();
  });

  $(".ds-input").on("input", function (evt) {
    let self = $(this);
    self.val(self.val().replace(/[^0-9\.]/g, ''));
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
      evt.preventDefault();
    }
    $(".hs-input").val(self.val())
    $(".ws-input").val(self.val())
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

$(document).ready(function () {
  $(".input-container").click(function () {
    $("#sequenceCheckbox").prop("checked", false)
  })

  $(".random-sequence-container").click(function () {
    $("#sequenceUpload").val('')
  })
})

$(document).ready(function () {
  $(".synthesizer-btn").click(function (e) {
    e.preventDefault()
    if ($('#synthesizer-shape').find(":selected").text() == "Cube") {
      const height = parseInt($(".height-input").val())
      const depth = parseInt($(".depth-input").val())
      const width = parseInt($(".width-input").val())
      const segments = parseInt($(".ws-input").val())
      let scaffold_length
      const used = (width * segments * 4 + height * segments * 4 + depth * segments * 4) / 0.332

      if ($("#8064-radiobtn").is(':checked')) {
        scaffold_length = 8064
      } else if ($("#7249-radiobtn").is(':checked')) {
        scaffold_length = 7249
      } else {
        scaffold_length = 0
      }
      const remaining = scaffold_length - used
      // find a better way to replace error messages
      console.log(remaining)
      if (scaffold_length - used < 0) {
        $(".danger-container").show()
        $(".warning-container").hide()

      } else if (scaffold_length - used > 200) {
        const textToShow = "(" + (Math.floor(scaffold_length - used)).toString() + ")."
        $(".warning-text").append(textToShow)
        $(".warning-container").show()
        $(".danger-container").hide()

      } else {
        $(".synthesize-form").submit()
      }
    }
  })
})

$(document).ready(function () {
  $("#continue_anchor").click(function (e) {
    console.log("fucks")
    e.preventDefault()
    $("#synthesize-form").submit()
  })
})

$(document).ready(function () {
  $("#visibility-input").click(() => {
    if ($("#visibility-input").prop("checked")) {
      $("#visibility-label").text("Public")
    } else {
      $("#visibility-label").text("Private")
    }
  })
})