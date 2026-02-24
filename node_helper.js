const NodeHelper = require("node_helper");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_ETORO_DATA") this.fetchEtoroData(payload);
    },

    async fetchEtoroData(config) {
        const pnlUrl = "https://public-api.etoro.com/api/v1/trading/info/real/pnl";
        const metaUrl = "https://public-api.etoro.com/api/v1/market-data/instruments";
        
        try {
            const headers = {
                "x-api-key": config.apiKey,
                "x-user-key": config.userKey,
                "x-request-id": uuidv4()
            };

            const pnlRes = await axios.get(pnlUrl, { headers });
            const positions = pnlRes.data.clientPortfolio.positions || [];
            
            // REMOVED FILTER: We now take everything with an active balance
            const activePositions = positions.filter(p => p.amount > 0);
            
            if (activePositions.length === 0) {
                return this.sendSocketNotification("ETORO_DATA_RESULT", []);
            }

            // Bulk Lookup using your discovery
            const uniqueIds = [...new Set(activePositions.map(p => p.instrumentID))];
            const metaRes = await axios.get(metaUrl, {
                headers,
                params: { instrumentIds: uniqueIds.join(",") }
            });

            const instrumentMeta = metaRes.data.instrumentDisplayDatas || [];
            const metaMap = {};
            instrumentMeta.forEach(i => {
                const svgImg = i.images.find(img => img.uri.endsWith(".svg"));
                metaMap[i.instrumentID] = {
                    name: i.instrumentDisplayName,
                    logo: svgImg ? svgImg.uri : (i.images[0]?.uri || "")
                };
            });

            const grouped = {};
            activePositions.forEach(pos => {
                const id = pos.instrumentID;
                if (!grouped[id]) {
                    grouped[id] = { 
                        name: metaMap[id]?.name || `ID:${id}`, 
                        logo: metaMap[id]?.logo || "",
                        value: 0, 
                        profit: 0 
                    };
                }
                grouped[id].value += pos.amount;
                // Path check for the 2026 PnL structure
                grouped[id].profit += (pos.unrealizedPnL ? pos.unrealizedPnL.pnL : 0);
            });

            this.sendSocketNotification("ETORO_DATA_RESULT", Object.values(grouped));
        } catch (error) {
            console.error("[MMM-eToro] Helper Error:", error.message);
        }
    }
});
