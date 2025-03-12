# Chrome Extension for Screenshot and Question Answering

This Chrome extension allows users to take screenshots of their screen, crop the image, and send it to Google's Gemini model (or any other free Google model) to answer multiple-choice questions. The response is then displayed directly in the popup interface.

## Features

- Take screenshots of the current screen.
- Crop the screenshot to focus on the area of interest.
- Send the cropped image to a Google model for question answering.
- Display the model's response in the popup.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd chrome-extension
   ```

3. Install dependencies (if any):
   ```
   npm install
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" at the top right.
   - Click on "Load unpacked" and select the `src` directory of the project.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. Use the "Take Screenshot" button to capture your screen.
3. Crop the screenshot to the desired area.
4. Enter your multiple-choice question in the provided input field.
5. Click "Submit" to send the image and question to the Google model.
6. View the response displayed in the popup.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.