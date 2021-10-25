$("#step_size_input").on("input", function(evt) {
    let self = $(this)
    self.val(self.val().replace(/[^0-9\.]/g, ''))
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
    {
      evt.preventDefault()
    } 
})

$("#loopout_length_input").on("input", function(evt) {
    let self = $(this)
    self.val(self.val().replace(/[^0-9\.]/g, ''))
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
    {
        evt.preventDefault()
    } 
})

$("#max_input").on("input", function(evt) {
    let self = $(this)
    self.val(self.val().replace(/[^0-9\.]/g, ''))
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
    {
      evt.preventDefault()
    } 
})

$("#min_input").on("input", function(evt) {
    let self = $(this)
    self.val(self.val().replace(/[^0-9\.]/g, ''))
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
    {
        evt.preventDefault()
    } 
})

$("#scaff_length_input").on("input", function(evt) {
    let self = $(this)
    self.val(self.val().replace(/[^0-9\.]/g, ''))
    if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) 
    {
      evt.preventDefault()
    } 
})
