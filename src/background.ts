const CLIENT_ID = encodeURIComponent("d6300d05a68b405c862121ab0c71130a")
const RESPONSE_TYPE = encodeURIComponent("token")
const REDIRECT_URI = encodeURIComponent("https://bmpehmhfieilbhonekjjngljoldjfoch.chromiumapp.org/")
const SCOPE = encodeURIComponent("user-read-email")
const SHOW_DIALOG = encodeURIComponent("false")
let STATE = ""
let accessToken = ""

let user_signed_in = false

function create_spotify_endpoint() {
    STATE = encodeURIComponent("meet" + Math.random().toString(36).substring(2, 15))

    let oauth2_url = `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&state=${STATE}
&scope=${SCOPE}
&show_dialog=${SHOW_DIALOG}
`

    return oauth2_url
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Got a request!", request)
    if (request.action === "login") {
        if (user_signed_in) {
            console.log("User is already signed in.")
        } else {
            chrome.identity.launchWebAuthFlow(
                {
                    url: create_spotify_endpoint(),
                    interactive: true,
                },
                function (redirect_url) {
                    if (chrome.runtime.lastError) {
                        sendResponse({ message: "fail" })
                    } else {
                        if (redirect_url.includes("callback?error=access_denied")) {
                            sendResponse({ message: "fail" })
                        } else {
                            accessToken = redirect_url.substring(redirect_url.indexOf("access_token=") + 13)
                            accessToken = accessToken.substring(0, accessToken.indexOf("&"))
                            let state = redirect_url.substring(redirect_url.indexOf("state=") + 6)

                            if (state === STATE) {
                                console.log("SUCCESS", accessToken, STATE)
                                user_signed_in = true

                                setTimeout(() => {
                                    accessToken = ""
                                    user_signed_in = false
                                }, 3600000)

                                sendResponse({ message: "success" })
                            } else {
                                sendResponse({ message: "fail" })
                            }
                        }
                    }
                }
            )
        }

        return true
    } else if (request.action === "logout") {
        user_signed_in = false
        sendResponse({ message: "success" })

        return true
    } else if (request.action === "authStateCheck") {
        sendResponse({ signedIn: user_signed_in })
    }
})
