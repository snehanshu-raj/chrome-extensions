chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "injectSolution" && message.solutionText) {
        chrome.scripting.executeScript({
            target: { tab: chrome.tabs.getCurrent() },
            function: injectCode,
            args: [message.solutionText]
        });
    }
});

function injectCode(code) {
    const editor = monaco.editor.getEditors()[0];
    if (editor) {
        editor.setValue(code);
    } else {
        console.error("Monaco editor not found.");
    }
}

// const editor = monaco.editor.getEditors()[0];
// editor.setValue(`// Your custom text here\nconsole.log("Hello, LeetCode!");`);