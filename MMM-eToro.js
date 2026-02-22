Module.register("MMM-eToro", {
    defaults: {
        apiKey: "",
        userKey: "",
        demo: true,
        updateInterval: 10 * 60 * 1000,
    },

    getStyles: function() {
        return ["MMM-eToro.css"];
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
            wrapper.innerHTML = "Fetching eToro Data...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        const data = this.portfolioData;
        
        // Defensive coding: If eToro sends nothing, use 0 instead of crashing
        const equity = data.totalValue || data.equity || 0;
        const profit = data.totalProfit || data.profit || 0;
        const percent = data.profitPercentage || data.gain || 0;

        const profitClass = profit >= 0 ? "positive" : "negative";

        wrapper.innerHTML = `
            <div class="etoro-container">
                <div class="etoro-header">eToro Portfolio</div>
                <div class="etoro-value">$${Number(equity).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                <div class="etoro-profit ${profitClass}">
                    ${profit >= 0 ? "+" : ""}$${Number(profit).toLocaleString(undefined, {minimumFractionDigits: 2})} 
                    (${Number(percent).toFixed(2)}%)
                </div>
            </div>
        `;
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ETORO_DATA_RESULT") {
            // Log to the browser console so you can see the raw data
            console.log("MMM-eToro received data:", payload);
            this.portfolioData = payload;
            this.updateDom();
        }
    }
});
