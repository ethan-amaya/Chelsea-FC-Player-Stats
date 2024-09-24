var myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "38ac76637b4b4723a11d6fd2e27dbbb9");
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

let playerStats = [];

const getAllPlayers = async () => {
    let page = 1;
    let hasMorePlayers = true;

    while (hasMorePlayers) {
        const response = await fetch(`https://v3.football.api-sports.io/players?team=49&season=2022&page=${page}`, requestOptions);
        const result = await response.json();

        if (result.response.length > 0) {
            result.response.forEach(playerInfo => {
                const playerName = playerInfo.player.lastname;
                const totalGoals = playerInfo.statistics.reduce((total, stat) => total + stat.goals.total, 0);
                const playerImage = playerInfo.player.photo;

                playerStats.push({ name: playerName, goals: totalGoals, image: playerImage });
                console.log(`Name: ${playerName}, Goals: ${totalGoals}`);
            });
            page++;
        } else {
            hasMorePlayers = false;
        }
    }
};

getAllPlayers().catch(error => console.log('error', error));


document.getElementById('searchButton').addEventListener('click', () => {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '';

    const filteredPlayers = playerStats.filter(player => player.name.toLowerCase().includes(searchQuery));

    if (filteredPlayers.length > 0) {
        filteredPlayers.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <img src="${player.image}" alt="${player.name}" />
                <h2>${player.name}</h2>
                <p>Goals Scored: ${player.goals}</p>
            `;
            resultDiv.appendChild(card);
        });
    } else {
        resultDiv.innerHTML = '<p>No players found.</p>';
    }
});
