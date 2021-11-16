$(document).ready(() => {
    const id = $("#generator-id-container").val()
    const positions = $("#routing-positions").val()
    $.post("/nanobot/" + id + "/routing_position_update", 
    {
        data: positions
    })
})