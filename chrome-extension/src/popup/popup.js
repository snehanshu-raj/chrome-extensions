const screenshotButton = document.getElementById("screenshot-btn");
const resultContainer = document.getElementById("result-container");
const responseParagraph = document.getElementById("response");
const API_KEY = "AIzaSyCUVcsvQ0BCIkA-AS5sZPZLXw0RGs7UyPU";

function captureScreenshot() {
    return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (imageUri) => {
            if (chrome.runtime.lastError) {
                reject("Failed to capture screenshot: " + chrome.runtime.lastError);
            } else {
                resolve(imageUri); // Return the image URI
            }
        });
    });
}

screenshotButton.addEventListener("click", () => {
    captureScreenshot()
        .then((imageUri) => {
            console.log("Screenshot taken successfully:", imageUri);
            sendToGemini(imageUri);
            // saveScreenshotToFile(imageUri);
        })
        .catch((error) => {
            console.error("Error capturing screenshot:", error);
        });
});

const sendToGemini = async (imageUri) => {
    const requestData = {
        contents: [
            {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/png",
                            data: imageUri.split(",")[1],
                        },
                    },
                    { text: "Extract the text from this image." },
                ],
            },
        ],
    };

    try {
        const apiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            }
        );

        if (!apiResponse.ok) {
            throw new Error(`HTTP error! status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        console.log('Gemini API response:', data);

        const resultText = data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0 ? data.candidates[0].content.parts[0].text : "No answer received";

        responseParagraph.textContent = resultText;
        resultContainer.style.display = "block";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            console.error("Network error or CORS issue.");
        } else if (error.message.startsWith("HTTP error!")) {
            console.error("API returned an error status code.");
        }
    }
};

function saveScreenshotToFile(imageUri) {
    const base64Data = imageUri.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: "screenshot.png",
        saveAs: true,
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error("Error downloading screenshot:", chrome.runtime.lastError);
        } else {
            console.log("Screenshot download started:", downloadId);
        }
    });
}