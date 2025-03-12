chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);
    if (request.action === "takeScreenshot") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                sendResponse({ error: "No active tab found." });
                return;
            }

            chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: "png" }, (screenshotUrl) => {
                if (chrome.runtime.lastError) {
                    sendResponse({ error: chrome.runtime.lastError.message });
                    return;
                }

                sendResponse({ image: screenshotUrl });
            });
        });

        return true; // Keep the sendResponse open for async response
    }
});
