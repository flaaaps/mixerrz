chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Got message", message)
    switch (message.action) {
        case "scan":
            console.log("")
            const publisher = document.querySelector(".publisher.style-scope.ytd-playlist-panel-renderer")
            console.log("Publisher content:", publisher.textContent)
            if (!!publisher?.textContent) {
                sendResponse({ success: false, error: "Not a mix" })
            } else {
                const tracksContainer = document.querySelectorAll(
                    "#items.playlist-items.style-scope.ytd-playlist-panel-renderer"
                )[0]

                var children = tracksContainer.children
                for (var i = 0; i < children.length; i++) {
                    var track = children[i]
                    const trackNameEl = track.querySelector(
                        "#video-title.style-scope.ytd-playlist-panel-video-renderer"
                    )
                    let trackName = trackNameEl?.textContent?.trim()
                    trackName.match(/(\h*[\(\[][^)]*?(?:Official|Lyric|Video)[^)]*?[\)\]])/gim)?.forEach(match => {
                        trackName = trackName.replace(match, "")
                    })
                    trackName = trackName.replace(/\(|\)|\[|\]/g, "")

                    let artists: string[] = []
                    trackName
                        .split("-")[0]
                        .trim()
                        .split(/&|,|and/)
                        .forEach((m, i) => {
                            if (i > 0) trackName = trackName.replace(m.trim(), "").replace(/&|,|and/, "")
                            artists.push(m.trim())
                        })

                    const re = RegExp("(ft.)|(feat.)", "gim")
                    let match
                    while ((match = re.exec(trackName)) != null) {
                        trackName
                            .substring(
                                match.index + match[0].length,
                                trackName.indexOf("-") > match.index ? trackName.indexOf("-") : trackName.length
                            )
                            .trim()
                            .split(/&|,|and/)
                            .forEach(m => {
                                if (!!m) artists.push(m.trim())
                            })

                        trackName = trackName.replace(
                            trackName.substring(
                                match.index,
                                trackName.indexOf("-") > match.index ? trackName.indexOf("-") : trackName.length
                            ),
                            ""
                        )
                    }

                    console.log("Name:", trackName)
                }
                sendResponse({
                    success: true,
                    message: "Found mix",
                    data: [], // songs
                })
            }
            break

        default:
            console.log("Got getText didn't find anything to do.")
            break
    }
})
