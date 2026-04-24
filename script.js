// 表示モードとソート状態の管理
let isShortFormat = false;
let currentSortKey = 'money'; 

// 数値を K や M に変換する関数
function formatNumber(num) {
    if (!isShortFormat) return num.toLocaleString();
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ソート用関数：ヘッダーをクリックした時に呼ばれる
window.sortTable = function(key) {
    currentSortKey = key;
    window.loadStats();
};

// 表記切り替えボタン用関数
window.toggleFormat = function() {
    isShortFormat = !isShortFormat;
    const btn = document.getElementById('formatBtn');
    if (btn) btn.innerText = isShortFormat ? "通常表記に戻す" : "K/M表記に切り替え";
    window.loadStats();
};

window.loadStats = async function() {
    try {
        const response = await fetch(`team_stats.json?t=${new Date().getTime()}`);
        const rootData = await response.json();
        
        const tbody = document.querySelector('#statsTable tbody');
        const timeElement = document.getElementById('time'); // メッセージ部分を取得
        
        if (!tbody) return;
        tbody.innerHTML = '';

        // 【修正】時刻データがなくても、とりあえず「読み込み中」は消す
        if (rootData.lastUpdated) {
            const lastUpdated = new Date(rootData.lastUpdated).toLocaleString();
            timeElement.innerText = `データ最終取得時刻: ${lastUpdated}`;
        } else {
            timeElement.innerText = `データ取得完了（時刻不明）`;
        }

        const players = rootData.players || [];
        
        // --- (ここから下の計算やループ処理は今のままでOKですが、念のため再掲) ---
        let totalMoney = 0, totalShards = 0, totalKills = 0, totalDeaths = 0;

        players.forEach(p => {
            const k = parseInt(p.kills) || 0;
            const d = parseInt(p.deaths) || 0;
            p.kd = d === 0 ? k : parseFloat((k / d).toFixed(2));
        });

        players.sort((a, b) => {
            let valA = a[currentSortKey] || 0;
            let valB = b[currentSortKey] || 0;
            if (currentSortKey === 'name') return valA.localeCompare(valB);
            return Number(valB) - Number(valA);
        });

        players.forEach(player => {
            const m = parseInt(player.money) || 0;
            const s = parseInt(player.shards) || 0;
            const k = parseInt(player.kills) || 0;
            const d = parseInt(player.deaths) || 0;

            totalMoney += m;
            totalShards += s;
            totalKills += k;
            totalDeaths += d;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name || 'Unknown'}</td>
                <td>${formatNumber(m)}</td>
                <td>${formatNumber(s)}</td>
                <td>${k.toLocaleString()}</td>
                <td>${d.toLocaleString()}</td>
                <td style="color: #00ffcc; font-weight: bold;">${player.kd.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });

        const totalKD = totalDeaths === 0 ? totalKills : (totalKills / totalDeaths).toFixed(2);
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `
            <td>TEAM TOTAL</td>
            <td>${formatNumber(totalMoney)}</td>
            <td>${formatNumber(totalShards)}</td>
            <td>${totalKills.toLocaleString()}</td>
            <td>${totalDeaths.toLocaleString()}</td>
            <td>${totalKD}</td>
        `;
        tbody.appendChild(totalRow);

    } catch (e) {
        console.error("読み込み失敗:", e);
        const timeElement = document.getElementById('time');
        if (timeElement) timeElement.innerText = 'エラー：データの読み込みに失敗しました。';
    }
};

window.onload = window.loadStats;