async function loadStats() {
    try {
        // キャッシュ対策をして取得
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

        // 所持金順にソート
        data.sort((a, b) => (b.money || 0) - (a.money || 0));

        data.forEach(player => {
            const m = player.money || 0;
            const k = player.kills || 0;
            const d = player.deaths || 0;

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

        // 合計行を追加
        const totalRow = `<tr class="total-row">
            <td>TEAM TOTAL</td>
            <td>${totalMoney.toLocaleString()}</td>
            <td>${totalKills}</td>
            <td>${totalDeaths}</td>
        </tr>`;
        tbody.innerHTML += totalRow;

    } catch (e) {
        console.error("読み込み失敗", e);
        document.getElementById('time').innerText = 'データの読み込みに失敗しました。';
    }
}

// ページ読み込み完了時に実行
window.onload = loadStats;