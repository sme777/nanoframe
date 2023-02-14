const nfrInputElement = document.querySelector(".upload-nfr-container");
const nfrForm = document.querySelector(".nfr-project-form");

nfrInputElement.addEventListener("change", handleFileUpload, false);

function handleFileUpload() {
    nfrForm.submit();
}