# LeetCode Problem Solver Chrome Extension

This project is a Chrome extension designed to assist users in solving LeetCode problems. When activated on a LeetCode problem page, the extension reads the problem statement and allows users to submit their solutions directly from the popup interface.

## Features

- Reads the problem statement from the LeetCode problem page.
- Displays the problem statement in a user-friendly popup.
- Allows users to write and submit their code solutions directly from the extension.

## Project Structure

```
leetcode-problem-solver
├── src
│   ├── background.js      # Background script for managing events and communication
│   ├── content.js         # Content script for reading problem statements
│   ├── popup.js           # Logic for the popup interface
│   ├── manifest.json      # Configuration file for the Chrome extension
│   └── popup.html         # HTML structure for the popup interface
├── package.json           # npm configuration file
└── README.md              # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/snehanshu-raj/leetcode-problem-solver.git
   ```
2. Navigate to the project directory:
   ```
   cd leetcode-problem-solver
   ```
3. Create a config.js file inside src/ and add the following line along with a Google Gemini Key:
   ```
      const CONFIG = {
         API_KEY: "YOUR_KEY"
      };
   ```

## Usage

1. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `src` directory of the project.

2. Navigate to a LeetCode problem page.

3. Click on the extension icon to open the popup.

4. The problem statement will be displayed, and you can write your solution in the provided input area.