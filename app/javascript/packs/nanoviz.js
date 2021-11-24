const box = document.getElementById("box-state")
const boxLabel = document.getElementById("box-state-label")

box.addEventListener("click", () => {
    if (box.checked) {
        boxLabel.innerHTML = "Close Form"
    } else {
        boxLabel.innerHTML = "Open Form"
    }
})
