Module.register("MMM-eToro", {
    defaults: { 
        updateInterval: 5 * 60 * 1000,
        header: "eToro Portfolio",
        showTotal: true
    },
    
    getStyles: function() { return ["MMM-eToro.css"]; },
    getHeader: function() { return this.config.header; },

    start: function() {
        this.portfolioData = []; 
        this.loaded = false;
        this.sendSocketNotification("GET_ETORO_DATA", this.config);
        
        setInterval(() => {
            this.sendSocketNotification("GET_ETORO_DATA", this.config);
        }, this.config.updateInterval);
    },

    getDom: function() {
        const wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = "Syncing Assets...";
            wrapper.className = "dimmed xsmall";
            return wrapper;
        }

        if (this.portfolioData.length === 0) {
            wrapper.innerHTML = "No Open Positions Found";
            wrapper.className = "dimmed xsmall";
            return wrapper;
        }

        const table = document.createElement("table");
        table.className = "xsmall etoro-table";
        
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr class="dimmed">
                <th></th>
                <th class="text-left">Asset</th>
                <th class="text-right">Value</th>
                <th class="text-right">P/L</th>
            </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        let totalValue = 0;
        let totalProfit = 0;

        this.portfolioData.forEach(item => {
            totalValue += item.value;
            totalProfit += item.profit;

            const row = document.createElement("tr");
            const pnlClass = item.profit >= 0 ? "positive" : "negative";
            const pnlSign = item.profit >= 0 ? "+" : "-";
            const pnlValue = Math.abs(item.profit).toLocaleString(undefined, {minimumFractionDigits: 2});
            const percValue = Math.abs(item.percentage).toFixed(2);

            row.innerHTML = `
                <td class="logo-cell"><img src="${item.logo}" class="stock-logo"></td>
                <td class="stock-name bright">${item.name}</td>
                <td class="text-right">$${item.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td class="text-right ${pnlClass}">
                    ${pnlSign}$${pnlValue}<br>
                    <span class="percentage-text">(${pnlSign}${percValue}%)</span>
                </td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        if (this.config.showTotal) {
            const tfoot = document.createElement("tfoot");
            const totalPnlClass = totalProfit >= 0 ? "positive" : "negative";
            const totalPnlSign = totalProfit >= 0 ? "+" : "-";
            const totalCostBasis = totalValue - totalProfit;
            const totalPerc = totalCostBasis !== 0 ? (totalProfit / totalCostBasis) * 100 : 0;

            tfoot.innerHTML = `
                <tr class="total-row">
                    <td></td>
                    <td class="bright">TOTAL</td>
                    <td class="text-right bright">$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td class="text-right ${totalPnlClass}">
                        ${totalPnlSign}$${Math.abs(totalProfit).toLocaleString(undefined, {minimumFractionDigits: 2})}<br>
                        <span class="percentage-text">(${totalPnlSign}${Math.abs(totalPerc).toFixed(2)}%)</span>
                    </td>
                </tr>`;
            table.appendChild(tfoot);
        }

        wrapper.appendChild(table);
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ETORO_DATA_RESULT") {
            this.portfolioData = payload;
            this.loaded = true; 
            this.updateDom();
        }
    }
});
