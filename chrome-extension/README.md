# Chrome Extension for Screenshot and Question Answering

This Chrome extension allows users to take screenshots of their screen, and send it to Google's Gemini model (or any other free Google model) to answer multiple-choice questions. The response is then displayed directly in the popup interface.

## Features

- Take screenshots of the current screen.
- Send the image to a VLM for question answering.
- Display the model's response in the popup.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/snehanshu-raj/smart-screenshot.git
   ```

2. Navigate to the project directory:
   ```
   cd chrome-extension
   ```

3. Create a config.js file inside src/popup/ and add the following like along with a Google Gemini Key:
   ```
      const CONFIG = {
         API_KEY: "YOUR_KEY"
      };
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" at the top right.
   - Click on "Load unpacked" and select the `src` directory of the project.

## Usage
1. Click on the extension icon in the Chrome toolbar.
2. Enter your prompt/ask in the provided input field.
3. Use the "Snap" button to capture your screen.
4. View the response displayed in the popup.
