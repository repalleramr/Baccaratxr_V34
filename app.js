// State Management
let state = {
    bankroll: 30000,
    startBankroll: 30000,
    rounds: [],
    currentY: null,
    currentK: null,
    ladder: Array(10).fill(100),
    settings: {
        capRule: false,
        minBet: 100,
        maxBet: 5000
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initVyuha();
    initLadder();
    setupEventListeners();
    updateUI();
});

function initVyuha() {
    const grid = document.getElementById('vyuha-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const tile = document.createElement('div');
        tile.className = 'vyuha-tile';
        tile.id = `tile-${i}`;
        tile.textContent = i;
        grid.appendChild(tile);
    }
}

function initLadder() {
    const body = document.getElementById('ladder-body');
    body.innerHTML = '';
    state.ladder.forEach((amt, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td><input type="number" value="${amt}" data-index="${i}" class="ladder-input"></td>
        `;
        body.appendChild(tr);
    });
}

function setupEventListeners() {
    // Nav Switching
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn, .tab-content').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Keypads
    document.querySelectorAll('.keypad button').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.textContent;
            const target = btn.parentElement.dataset.target;
            if (target === 'yaksha') {
                state.currentY = parseInt(val);
                document.getElementById('input-y').textContent = val;
            } else {
                state.currentK = parseInt(val);
                document.getElementById('input-k').textContent = val;
            }
            checkRoundComplete();
        });
    });

    // Controls
    document.getElementById('btn-undo').onclick = undoLast;
    document.getElementById('btn-clear').onclick = () => {
        if(confirm("Clear Kumbha?")) resetRoundInputs();
    };
    document.getElementById('btn-new').onclick = () => {
        if(confirm("Start New Kumbha?")) {
            state.rounds = [];
            state.bankroll = state.startBankroll;
            updateUI();
        }
    };

    // CSV Export
    document.getElementById('btn-export').onclick = exportCSV;
}

function checkRoundComplete() {
    if (state.currentY !== null && state.currentK !== null) {
        processRound(state.currentY, state.currentK);
        resetRoundInputs();
    }
}

function processRound(y, k) {
    const bet = state.settings.minBet; // Simplified logic for template
    state.bankroll -= bet; 
    
    const roundData = {
        id: state.rounds.length + 1,
        y, k, bet,
        bankroll: state.bankroll
    };
    
    state.rounds.push(roundData);
    updateUI();
}

function resetRoundInputs() {
    state.currentY = null;
    state.currentK = null;
    document.getElementById('input-y').textContent = '-';
    document.getElementById('input-k').textContent = '-';
}

function undoLast() {
    if (state.rounds.length > 0) {
        const last = state.rounds.pop();
        state.bankroll += last.bet;
        updateUI();
    }
}

function updateUI() {
    document.getElementById('live-bankroll').textContent = `₹${state.bankroll}`;
    document.getElementById('start-display').textContent = `Start ₹${state.startBankroll}`;
    
    // Stats
    document.getElementById('stat-y').textContent = state.rounds.length;
    document.getElementById('stat-t').textContent = state.rounds.length;
    
    // Granth Table
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';
    [...state.rounds].reverse().forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.id}</td><td>${r.y}</td><td>${r.k}</td><td>${r.bet}</td><td>${r.bankroll}</td>`;
        tbody.appendChild(tr);
    });

    // Analytics
    document.getElementById('ana-rounds').textContent = state.rounds.length;
    document.getElementById('ana-bankroll').textContent = `₹${state.bankroll}`;
}

function exportCSV() {
    let csv = "Round,Yaksha,Kinnara,Bet,Bankroll\n";
    state.rounds.forEach(r => {
        csv += `${r.id},${r.y},${r.k},${r.bet},${r.bankroll}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'kubera_history.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
