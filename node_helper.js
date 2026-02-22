const NodeHelper = require("node_helper");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // You may need to run 'npm install uuid'

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_ETORO_DATA") {
            this.fetchEtoroData(payload);
        }
    },

    fetchEtoroData: async function(config) {
        // Switch URL based on whether you're using Demo or Real keys
        const baseUrl = config.demo 
            ? "https://demo-api.etoro.com/api/v1/portfolio/summary" 
            : "https://public-api.etoro.com/api/v1/portfolio/summary";

        try {
            const response = await axios.get(baseUrl, {
                headers: {
                    "x-api-key": config.apiKey,
                    "x-user-key": config.userKey,
                    "x-request-id": uuidv4(), // Required for eToro 2026 API
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            // LOGGING: This helps you see the structure in your terminal
            console.log(`[${this.name}] Data fetched successfully.`);
            
            // Send the data back to MMM-eToro.js
            // We pass the inner data object if eToro wraps it
            const result = response.data.data || response.data;
            this.sendSocketNotification("ETORO_DATA_RESULT", result);

        } catch (error) {
            if (error.response) {
                console.error(`[${this.name}] API Error ${error.response.status}:`, error.response.data);
            } else {
                console.error(`[${this.name}] Connection Error:`, error.message);
            }
        }
    }
});
