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

document.getElementById('copy').addEventListener('click', copyCodeToClipboard);
function copyCodeToClipboard() {
    const solutionTextarea = document.getElementById('solution');
    solutionTextarea.select();
    document.execCommand('copy');
    alert('Code copied to clipboard!');
}

document.getElementById("solve").addEventListener("click", async () => {
    try {
        // Capture screenshot
        const imageUri = await captureScreenshot();
        console.log("Screenshot taken successfully:", imageUri);

        // Send to Gemini
        const promptMessage = `Return the response as a JSON object with two fields: 
                              i. "filename" (a valid filename inline with the problem statment with extension based on the detected language e.g. if the language selected in the editor is python, comeup with an accurate problem name defining the problem statemt or visible in the top and append the extension like <problemName>.py").
                              ii. "code" (the actual code solution). 
                              Do not include markdown formatting like triple backticks in the code.
                              ` 
                    
        const response = await sendToGemini(imageUri, promptMessage);
        
        if (response.code !== "No solution received") {
            console.log("Injecting solution into LeetCode editor...");
            document.getElementById('solution').value = response.code;
            saveCodeToFile(response.filename, response.code);

        // if (resultText && resultText !== "No answer received") {
        //     console.log("Injecting solution into LeetCode editor...");
        //     // injectScript(resultText);
        //     document.getElementById('solution').value = resultText.code.replace(/^```[a-zA-Z0-9]+\n|```$/g, '').trim();
        //     saveCodeToFile(resultText);
        } else {
            console.error("No valid solution received from Gemini.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
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
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        responseText = responseText.replace(/^```json\n|```$/g, '').trim();
        const parsedResponse = JSON.parse(responseText);
        
        return {
            filename: parsedResponse.filename || "solution.txt",
            code: parsedResponse.code || "No solution received"
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
    }
};

function injectScript(solutionText) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["inject.js"]
            }, () => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "injectSolution", solutionText });
            });
        }
    });
}

function saveCodeToFile(filename, code) {
    const extension = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
        "js": "application/javascript",
        "py": "text/x-python",
        "java": "text/x-java-source",
        "cpp": "text/x-c++src",
        "c": "text/x-csrc",
        "txt": "text/plain"
    };

    const mimeType = mimeTypes[extension] || "text/plain";

    const blob = new Blob([code], { type: mimeType });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url: url,
        filename: `LeetcodeSolutions/${filename}`,
        saveAs: false
    });

    console.log(`Code saved as ${filename}`);
}
