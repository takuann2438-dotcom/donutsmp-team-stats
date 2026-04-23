require('dotenv').config();
const fs = require('fs');

const API_KEY = process.env.DONUT_API_KEY;
// チームメンバーのマイクラIDを配列に入れる
const TEAM_MEMBERS = ['takanah_oisii', '.nynsyuu', 'HatterSheep', 'Neko_Gunsou']; 

async function fetchPlayerStats(playerName) {
    const url = `https://api.donutsmp.net/v1/stats/${playerName}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.status === 200 ? { name: playerName, ...data.result } : null;
    } catch (error) {
        console.error(`${playerName}の取得失敗:`, error);
        return null;
    }
}

async function updateAllStats() {
    console.log(`${new Date().toLocaleString()} 取得開始...`);
    const allStats = [];

    for (const name of TEAM_MEMBERS) {
        const stats = await fetchPlayerStats(name);
        if (stats) {
            allStats.push(stats);
            console.log(`✅ ${name} のデータを取得しました`);
        }
        // 連続リクエストによる負荷を避けるため、少し待機（0.5秒）
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 全員のデータを1つのJSONファイルに保存
    fs.writeFileSync('team_stats.json', JSON.stringify(allStats, null, 2));
    console.log('--- 全員のデータを保存しました ---');
}

// 実行
updateAllStats();