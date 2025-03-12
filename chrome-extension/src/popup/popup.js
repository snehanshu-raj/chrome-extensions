const screenshotButton = document.getElementById("screenshot-btn");
const resultContainer = document.getElementById("result-container");
const responseParagraph = document.getElementById("response");
const promptInput = document.getElementById("prompt-input");

function captureScreenshot() {
    return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (imageUri) => {
            if (chrome.runtime.lastError) {
                reject("Failed to capture screenshot: " + chrome.runtime.lastError);
            } else {
                resolve(imageUri);
            }
        });
    });
}

screenshotButton.addEventListener("click", () => {
    captureScreenshot()
        .then((imageUri) => {
            console.log("Screenshot taken successfully:", imageUri);
            const promptMessage = promptInput.value || "Answer the question based on the image.";
            sendToGemini(imageUri, promptMessage);
        })
        .catch((error) => {
            console.error("Error capturing screenshot:", error);
        });
});

const sendToGemini = async (imageUri, promptMessage) => {
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
                    { text: promptMessage },
                ],
            },
        ],
    };

    try {
        const apiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.API_KEY}`,
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
        const resultText =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer received";

        responseParagraph.textContent = resultText;
        resultContainer.style.display = "block"; // Show the result container
    } catch (error) {
        console.error("Error calling Gemini API:", error);
    }
};