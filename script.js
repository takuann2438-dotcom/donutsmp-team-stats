// 表示モードの管理 (false: 通常, true: 略称)
let isShortFormat = false;

// 数値を K や M に変換する関数
function formatNumber(num) {
    if (!isShortFormat) return num.toLocaleString();

    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ボタンが押された時の処理
function toggleFormat() {
    isShortFormat = !isShortFormat;
    const btn = document.getElementById('formatBtn');
    btn.innerText = isShortFormat ? "通常表記に戻す" : "K/M表記に切り替え";
    loadStats(); // 再描画
}

async function loadStats() {
    try {
        const response = await fetch(`team_stats.json?t=${new Date().getTime()}`);
        const rootData = await response.json();
        
        const tbody = document.querySelector('#statsTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (rootData.lastUpdated) {
            const lastUpdated = new Date(rootData.lastUpdated).toLocaleString();
            document.getElementById('time').innerText = `データ最終取得時刻: ${lastUpdated}`;
        }

        const players = rootData.players || [];
        
        let totalMoney = 0;
        let totalKills = 0;
        let totalDeaths = 0;

        players.sort((a, b) => Number(b.money || 0) - Number(a.money || 0));

        players.forEach(player => {
            const m = parseInt(player.money) || 0;
            const k = parseInt(player.kills) || 0;
            const d = parseInt(player.deaths) || 0;

            totalMoney += m;
            totalKills += k;
            totalDeaths += d;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name || 'Unknown'}</td>
                <td>${formatNumber(m)}</td>
                <td>${k}</td>
                <td>${d}</td>
            `;
            tbody.appendChild(row);
        });

        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `
            <td>TEAM TOTAL</td>
            <td>${formatNumber(totalMoney)}</td>
            <td>${totalKills.toLocaleString()}</td>
            <td>${totalDeaths.toLocaleString()}</td>
        `;
        tbody.appendChild(totalRow);

    } catch (e) {
        console.error("読み込み失敗:", e);
        document.getElementById('time').innerText = 'データの読み込みに失敗しました。';
    }
}

window.onload = loadStats;