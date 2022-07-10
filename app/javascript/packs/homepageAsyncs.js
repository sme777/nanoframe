$("#public_generators").on("click", () => {
    $.ajax({
        url: "/filter_generators",
        data: {
            type: "public"
        },
        dataType: "json"
    });
});

$("#private_generators").on("click", () => {
    $.ajax({
        url: "/filter_generators",
        data: {
            type: "private"
        },
        dataType: "json"
    });
});

$("#all_generators").on("click", () => {
    $.ajax({
        url: "/filter_generators",
        data: {
            type: "all"
        },
        dataType: "json"
    });
});