$(document).ready( function() {
    $(".molstar-view").click(function() {
        $(".molstar-view-link").addClass("active")
        $(".oxview-link").removeClass("active")
        // set iframe url
        $(".iframe-viewer").attr("src", molstarURL)
    }) 


    $(".oxview").click(function() {
        $(".molstar-view-link").removeClass("active")
        $(".oxview-link").addClass("active")
        // set iframe url
        $(".iframe-viewer").attr("src", oxviewURL)
        
    }) 

    let oxviewURL = function () {
        return "https://sulcgroup.github.io/oxdna-viewer/"
    }

    let molstarURL = function () {
        return "https://molstar.org/viewer/"
    }
})
 