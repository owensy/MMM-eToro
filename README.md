# MMM-eToro

A MagicMirror² module to display your eToro portfolio summary, including total equity, current profit/loss, and percentage gains in real-time.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features
* **Real-time Portfolio Value:** Displays your total equity.
* **Profit Tracking:** Shows total gain/loss with color-coded indicators (Green for profit, Red for loss).
* **Privacy First:** API keys are handled via your main config, never hardcoded.

## Prerequisites
1.  An eToro account.
2.  An eToro API Key and User Key. 
    * Note: These can be generated under Settings > Trading > API Key Management.

## Installation

1.  Navigate to your MagicMirror modules directory:
    cd ~/MagicMirror/modules

2.  Clone this repository:
    git clone https://github.com/YOUR_USERNAME/MMM-eToro.git

3.  Enter the module directory and install dependencies:
    cd MMM-eToro
    npm install

## Configuration

Add the following to the modules array in your config/config.js file:

{
    module: "MMM-eToro",
    position: "top_right",
    config: {
        apiKey: "YOUR_ETORO_API_KEY",
        userKey: "YOUR_ETORO_USER_KEY",
        updateInterval: 600000, // 10 minutes
    }
},

## Configuration Options

| Option | Description |
| --- | --- |
| apiKey | Required. Your eToro Public API Key. |
| userKey | Required. Your eToro User Key. |
| updateInterval | How often to fetch data (in milliseconds). Default is 10 mins. |

## CSS Styling
Customize the look by editing MMM-eToro.css. It uses standard MagicMirror classes for a native look.

## Disclaimer
This module is for informational purposes only. Use it at your own risk. The developer is not responsible for any financial decisions made based on the data displayed.

## License
MIT
