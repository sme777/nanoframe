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
    $(".sidebarContent").scroll(() => {
        // console.log($(".sidebarContent")[0])
        // console.log( $(".sidebarContent").prop('scrollHeight'))
    })
})