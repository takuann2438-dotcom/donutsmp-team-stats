async function loadStats() {
    try {
        const response = await fetch(`team_stats.json?t=${new Date().getTime()}`);
        const rootData = await response.json();
        
        if (rootData.lastUpdated) {
            const lastUpdated = new Date(rootData.lastUpdated).toLocaleString();
            document.getElementById('time').innerText = `データ最終取得時刻: ${lastUpdated}`;
        }

        const data = rootData.players || [];
        const tbody = document.querySelector('#statsTable tbody');
        tbody.innerHTML = '';

        let totalMoney = 0;
        let totalKills = 0;
        let totalDeaths = 0;

        data.sort((a, b) => (b.money || 0) - (a.money || 0));

        data.forEach(player => {
            // Number() で確実に「数字」として扱う
            const m = Number(player.money || 0);
            const k = Number(player.kills || 0);
            const d = Number(player.deaths || 0);

            totalMoney += m;
            totalKills += k;
            totalDeaths += d;

            const row = `<tr>
                <td>${player.name || 'Unknown'}</td>
                <td>${m.toLocaleString()}</td>
                <td>${k}</td>
                <td>${d}</td>
            </tr>`;
            tbody.innerHTML += row;
        });

        const totalRow = `<tr class="total-row">
            <td>TEAM TOTAL</td>
            <td>${totalMoney.toLocaleString()}</td>
            <td>${totalKills.toLocaleString()}</td>
            <td>${totalDeaths.toLocaleString()}</td>
        </tr>`;
        tbody.innerHTML += totalRow;

    } catch (e) {
        console.error("読み込み失敗", e);
        document.getElementById('time').innerText = 'データの読み込みに失敗しました。';
    }
}

window.onload = loadStats;