
const elements = {
    coinsList: document.getElementById('coins-list'),
    trendingCoins: document.getElementById('trending-coins'),
    searchInput: document.getElementById('search-input'),
    clearSearch: document.getElementById('clear-search'),
    resultsList: document.getElementById('results-list'),
    noResults: document.getElementById('no-results'),
    prevPage: document.getElementById('prev-page'),
    nextPage: document.getElementById('next-page'),
    currentPageEl: document.getElementById('current-page'),
    totalPagesEl: document.getElementById('total-pages')
};

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
let currentPage = 1;
let totalPages = 1;


const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        return response.ok ? await response.json() : Promise.reject('Error fetching data');
    } catch (error) {
        console.error(error);
    }
};


const renderCoins = (coins) => {
    elements.coinsList.innerHTML = coins.map(coin => `
        <li>${coin.name} - ${coin.current_price} INR</li>
    `).join('');
};


const loadTopCryptos = async () => {
    const data = await fetchData(`/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=1`);
    if (data) renderCoins(data);
};

document.addEventListener('DOMContentLoaded', loadTopCryptos);

const changePage = (offset) => {
    if ((currentPage + offset) >= 1 && (currentPage + offset) <= totalPages) {
        currentPage += offset;
        loadCoins();
    }
};



const searchCrypto = async () => {
    const query = elements.searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    const data = await fetchData(`/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1`);
    if (data) {
        const result = data.find(coin => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query));
        elements.resultsList.innerHTML = result ? 
            `<li>${result.name} (${result.symbol.toUpperCase()}) - ${result.current_price} INR</li>` : 
            '<li>No results found</li>';
    }
};

elements.searchInput.addEventListener('input', searchCrypto);

elements.prevPage.addEventListener('click', () => changePage(-1));
elements.nextPage.addEventListener('click', () => changePage(1));

document.addEventListener('DOMContentLoaded', loadCoins);
