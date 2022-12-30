const wrapper = document.querySelector(".wrapper");
const form = wrapper.querySelector("form");
const fileInput = form.querySelector("input");
const infoText = form.querySelector("p");
const textArea = wrapper.querySelector("textarea");

const close = wrapper.querySelector(".close");
const copy = wrapper.querySelector(".copy");
const visit = wrapper.querySelector(".visit");

function fetchRequest(formData, file){
    infoText.innerText = "Scanning QR Code...";

    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: "POST", body: formData
    }).then(res => res.json())
    .then(result => {
        result = result[0].symbol[0].data;
        infoText.innerText = result ? "Upload QR Code to scan." : "Couldn't read your QR Code!";
        if(!result) return;
        textArea.innerText = result;
        form.querySelector("img").src = URL.createObjectURL(file);
        wrapper.classList.add("active");
    }).catch(() => {
        infoText.innerText = "Couldn't read your QR Code!";
    });
}

fileInput.addEventListener("change", e => {
    let file = e.target.files[0];
    if(!file) return;
    let formData = new FormData();
    formData.append("file", file);
    fetchRequest(formData, file);
});

form.addEventListener("click", () => fileInput.click());

copy.addEventListener("click", () => {
    let text = textArea.textContent;
    navigator.clipboard.writeText(text);
});

close.addEventListener("click", () => wrapper.classList.remove("active"));

const isValidUrl = urlString=> {
    try { 
        return Boolean(new URL(urlString)); 
    }
    catch(e){ 
        return false; 
    }
}

visit.addEventListener("click" ,() => {
    let link = textArea.textContent;
    if(isValidUrl(link)){
        parent.open(`${link}`);
    }
});