const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
    socketNotificationReceived: async function(notification, payload) {
        if (notification === "GET_ETORO_DATA") {
            try {
                const response = await axios.get("https://public-api.etoro.com/api/v1/portfolio/summary", {
                    headers: {
                        "x-api-key": payload.apiKey,
                        "x-user-key": payload.userKey
                    }
                });
                // Assuming API returns: { totalValue: 1000, totalProfit: 50, profitPercentage: 5 }
                this.sendSocketNotification("ETORO_DATA_RESULT", response.data);
            } catch (error) {
                console.error("MMM-eToro Helper Error:", error);
            }
        }
    }
});
