const NodeHelper = require("node_helper");
const { v4: uuidv4 } = require("uuid");

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_ETORO_DATA") this.fetchEtoroData(payload);
    },

    async fetchEtoroData(config) {
        const pnlUrl = "https://public-api.etoro.com/api/v1/trading/info/real/pnl";
        const metaUrl = "https://public-api.etoro.com/api/v1/market-data/instruments";
        const headers = {
            "x-api-key": config.apiKey,
            "x-user-key": config.userKey,
            "x-request-id": uuidv4(),
            "Accept": "application/json"
        };

        try {
            const pnlRes = await fetch(pnlUrl, { headers });
            const pnlData = await pnlRes.json();
            const positions = pnlData.clientPortfolio?.positions || [];
            const activePositions = positions.filter(p => p.amount > 0);

            if (activePositions.length === 0) {
                return this.sendSocketNotification("ETORO_DATA_RESULT", []);
            }

            const uniqueIds = [...new Set(activePositions.map(p => p.instrumentID))];
            const metaRes = await fetch(`${metaUrl}?instrumentIds=${uniqueIds.join(",")}`, { headers });
            const metaData = await metaRes.json();

            const instrumentMeta = metaData.instrumentDisplayDatas || [];
            const metaMap = {};
            instrumentMeta.forEach(i => {
                const svgImg = i.images.find(img => img.uri.endsWith(".svg"));
                metaMap[i.instrumentID] = {
                    name: i.instrumentDisplayName,
                    logo: svgImg ? svgImg.uri : (i.images[0]?.uri || "")
                };
            });

            const groupedMap = activePositions.reduce((acc, pos) => {
                const id = pos.instrumentID;
                if (!acc[id]) {
                    acc[id] = { 
                        name: metaMap[id]?.name || `ID:${id}`, 
                        logo: metaMap[id]?.logo || "",
                        value: 0, 
                        profit: 0 
                    };
                }
                acc[id].value += pos.amount;
                acc[id].profit += (pos.unrealizedPnL ? pos.unrealizedPnL.pnL : 0);
                return acc;
            }, {});

            const grouped = Object.values(groupedMap).map(item => {
                const costBasis = item.value - item.profit;
                item.percentage = costBasis !== 0 ? (item.profit / costBasis) * 100 : 0;
                return item;
            });

            this.sendSocketNotification("ETORO_DATA_RESULT", grouped);
        } catch (error) {
            console.error("[MMM-eToro] Fetch Error:", error);
        }
    }
});
