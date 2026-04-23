async function loadStats() {
    try {
        const response = await fetch(`team_stats.json?t=${new Date().getTime()}`);
        const rootData = await response.json();
        
        const tbody = document.querySelector('#statsTable tbody');
        if (!tbody) return; // tableが見つからない場合は中断
        tbody.innerHTML = '';

        if (rootData.lastUpdated) {
            const lastUpdated = new Date(rootData.lastUpdated).toLocaleString();
            document.getElementById('time').innerText = `データ最終取得時刻: ${lastUpdated}`;
        }

        const players = rootData.players || [];
        
        // 合計用の変数を「最初から数字の0」でリセット
        let totalMoney = 0;
        let totalKills = 0;
        let totalDeaths = 0;

        // 所持金順にソート
        players.sort((a, b) => Number(b.money || 0) - Number(a.money || 0));

        players.forEach(player => {
            // 文字列を「整数」に強制変換（int型のように扱う）
            const m = parseInt(player.money) || 0;
            const k = parseInt(player.kills) || 0;
            const d = parseInt(player.deaths) || 0;

            totalMoney += m;
            totalKills += k;
            totalDeaths += d;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name || 'Unknown'}</td>
                <td>${m.toLocaleString()}</td>
                <td>${k}</td>
                <td>${d}</td>
            `;
            tbody.appendChild(row);
        });

        // 合計行の作成
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row'; // style.cssで設定したクラス
        totalRow.innerHTML = `
            <td>TEAM TOTAL</td>
            <td>${totalMoney.toLocaleString()}</td>
            <td>${totalKills.toLocaleString()}</td>
            <td>${totalDeaths.toLocaleString()}</td>
        `;
        tbody.appendChild(totalRow);

    } catch (e) {
        console.error("読み込み失敗:", e);
        document.getElementById('time').innerText = 'データの読み込みに失敗しました。';
    }
}

// ページ読み込み完了時に確実に実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStats);
} else {
    loadStats();
}