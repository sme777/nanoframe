$(document).ready(function () {
  const fields = ["step_size", "loopout_length", "max", "min", "scaff_length"];
  for (let i in fields) {
    $(`#${fields[i]}_input`).on("input", function (evt) {
      let self = $(this);
      self.val(self.val().replace(/[^0-9\.]/g, ""));
      if (
        (evt.which != 46 || self.val().indexOf(".") != -1) &&
        (evt.which < 48 || evt.which > 57)
      ) {
        evt.preventDefault();
      }
    });
  }
});
