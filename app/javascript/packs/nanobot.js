let requiredParams = [];

$(document).ready(function () {
  $("#synthesizer-shape").val(0);
  $(".synthesizer-btn").prop("disabled", true);

  preventAllInput("height", "depth", "width", "divisions");

  const allInputs = [
    "height",
    "width",
    "depth",
    "divisions"
  ];

  requiredParams = displayInputs(
    "height",
    "width",
    "depth",
    "divisions"
  );

  preventAllInput("height", "depth", "width", "divisions");
  checkIfDone();

  $("#synthesizer-shape").click(function () {
    let synthesizerChoice = $("#synthesizer-shape").find(":selected").text();
    $(".synthesizer-btn").prop("disabled", true);
    $(".dimension-input").val("");

    if (synthesizerChoice == "Cube (P1)") {
      requiredParams = displayInputs(
        "height",
        "width",
        "depth",
        "divisions"
      );
      preventAllInput("height", "depth", "width", "divisions");
    } 
  });

  function displayInputs(...args) {
    params = [];
    for (let i = 0; i < allInputs.length; i++) {
      let input = allInputs[i];
      if (args.includes(input)) {
        $(`.${input}-container`).show();
        params.push(`.${input}-input`);
      } else {
        $(`.${input}-container`).hide();
      }
    }
    return params;
  }

  function preventAllInput(...args) {
    for (let i = 0; i < args.length; i++) {
      let input = args[i];
      $(`.${input}-input`).on("input", function (evt) {
        let self = $(this);
        self.val(self.val().replace(/[^0-9\.]/g, ""));
        if (
          (evt.which != 46 || self.val().indexOf(".") != -1) &&
          (evt.which < 48 || evt.which > 57)
        ) {
          evt.preventDefault();
        }
        checkIfDone();
      });
    }
  }

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

  function updatePlaceholders(map) {
    for (let i in map) {
      $(`.${i}-input`).prop("placeholder", map[i]);
    }
  }
});

$(document).ready(function () {
  $(".input-container").click(function () {
    $("#sequenceCheckbox").prop("checked", false);
  });

  $(".random-sequence-container").click(function () {
    $("#sequenceUpload").val("");
  });
});

$(document).ready(function () {
  console.log($("#generator_scaffold_name").val())
  $(".synthesizer-btn").click(function (e) {
    e.preventDefault();
    if ($("#generator_shape").find(":selected").text() == "Cube (P1)") {
      const height = parseInt($(".height-input").val());
      const depth = parseInt($(".depth-input").val());
      const width = parseInt($(".width-input").val());
      const segments = parseInt($(".divisions-input").val());
      let scaffold_length;
      const used =
        (width * segments * 4 + height * segments * 4 + depth * segments * 4) /
        0.332;

      if ($("#generator_scaffold_name").val() == "M13mp18 p7249") {
        scaffold_length = 7249;
      } else if ($("#generator_scaffold_name").val() == 'M13mp18 p8064') {
        scaffold_length = 8064;
      } else {
        scaffold_length = 0;
      }
      console.log(scaffold_length)
      // find a better way to replace error messages
      if (scaffold_length - used < 0) {
        $(".danger-container").show();
        $(".warning-container").hide();
      } else if (scaffold_length - used > 200) {
        const textToShow =
          "(" + Math.floor(scaffold_length - used).toString() + ").";
        $(".warning-text").append(textToShow);
        $(".warning-container").show();
        $(".danger-container").hide();
      } else {
        $(".synthesize-form").submit();
      }
    } else {
      $(".synthesize-form").submit();
    }
  });
});

$(document).ready(function () {
  $("#continue_anchor").click(function (e) {
    e.preventDefault();
    $("#synthesize-form").submit();
  });
});

$(document).ready(function () {
  $("#visibility-input").click(() => {
    if ($("#visibility-input").prop("checked")) {
      $("#visibility-label").text("Public");
    } else {
      $("#visibility-label").text("Private");
    }
  });
});

$(document).ready(function () {
  $(".custom-scaffold-length").click(() => {
    $("#7249-radiobtn").prop("checked", false);
    $("#8064-radiobtn").prop("checked", false);
  });
});

$(document).ready(function () {
  $("#generator_scaffold_name").click(() => {
    if ($("#generator_scaffold_name").val() == 'Custom') {
      $(".custom-scaffold-container").show();
      $("#sequence_checkbox").prop("checked", true);
    } else {
      $(".custom-scaffold-container").hide();
      $("#sequence_checkbox").prop("checked", false);
    }
  })
})
