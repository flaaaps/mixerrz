chrome.runtime.sendMessage({ action: "authStateCheck" }, response => {
    console.log(response.signedIn, "SIGNED IN?!")
    if (response.signedIn) {
        document.getElementById("main").style.display = "block"
    } else {
        document.getElementById("login").style.display = "block"
    }
})

// Auth stuff
const loginBtn = document.getElementById("login-btn")

loginBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "login" }, (response: { message: "success" | "fail" }) => {
        console.log("Response from login:", response)
        if (response.message === "success") {
            document.getElementById("login").style.display = "none"
            document.getElementById("main").style.display = "block"
        }
    })
})

// Mix scanner
const scanBtn = document.getElementById("scan-btn")

scanBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("We got some tabs:", tabs)
        chrome.tabs.sendMessage(tabs[0].id, { action: "scan" }, function (response) {
            console.log(response)
        })
    })
})
