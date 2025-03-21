// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//     if (request.action === "saveScreenshot") {
//         try {
//             const blob = await (await fetch(request.screenshotUrl)).blob();
//             const fileHandle = await window.showSaveFilePicker({
//                 suggestedName: 'screenshot.png',
//                 types: [{
//                     description: 'PNG Image',
//                     accept: { 'image/png': ['.png'] },
//                 }],
//             });
//             const writableStream = await fileHandle.createWritable();
//             await writableStream.write(blob);
//             await writableStream.close();
//             sendResponse({ success: true });
//         } catch (error) {
//             console.error("Error saving screenshot:", error);
//             sendResponse({ error: error.message });
//         }
//     }
// });