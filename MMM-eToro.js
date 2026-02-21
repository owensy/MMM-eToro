Module.register("MMM-eToro", {
    defaults: {
        apiKey: "",
        userKey: "",
        updateInterval: 10 * 60 * 1000, // 10 minutes
    },

    start: function() {
        this.portfolioData = null;
        this.sendSocketNotification("GET_ETORO_DATA", this.config);
        
        setInterval(() => {
            this.sendSocketNotification("GET_ETORO_DATA", this.config);
        }, this.config.updateInterval);
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        if (!this.portfolioData) {
            wrapper.innerHTML = "Loading eToro...";
            return wrapper;
        }

        const data = this.portfolioData;
        const profitClass = data.totalProfit >= 0 ? "positive" : "negative";

        wrapper.innerHTML = `
            <div class="etoro-container">
                <div class="etoro-header">Portfolio Value</div>
                <div class="etoro-value">$${data.totalValue.toLocaleString()}</div>
                <div class="etoro-profit ${profitClass}">
                    ${data.totalProfit >= 0 ? "+" : ""}$${data.totalProfit.toLocaleString()} 
                    (${data.profitPercentage}%)
                </div>
            </div>
        `;
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ETORO_DATA_RESULT") {
            this.portfolioData = payload;
            this.updateDom();
        }
    },

    getStyles: function() { return ["MMM-eToro.css"]; }
});
