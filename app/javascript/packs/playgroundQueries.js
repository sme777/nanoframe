$(document).ready(function() {
    
    $(".sidebarSearchField").on('input', () => {
        if ($(".sidebarSearchField").val().length > 0) {
            $(".exitSearchBar").show()
        } else {
            $(".exitSearchBar").hide()
        }
    })

    $(".exitSearchBar").click(() => {
        $(".sidebarSearchField").val("")
        $(".exitSearchBar").hide()
    })
})

$(document).ready(function() {
    $(".createCustomButton").click(() => {
        $(".createCustomFieldContainer").css({"display": "block"});
    })

    $(".formCloseButton").click(() => {
        $(".createCustomFieldContainer").css({"display": "none"});
    })
})