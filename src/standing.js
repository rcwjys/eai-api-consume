const API_KEY = '9488fb4ee2f5d6d77e08a49c4faf8d766da2607ba458cb9632459e5d36f3848f';

window.addEventListener('load', async (e) => {
  await provideCountriesData();
  await provideLeaguesData();
});

async function provideCountriesData() {
  try {
    const url = `https://apiv3.apifootball.com/?action=get_countries&APIkey=${API_KEY}`;
    const countriesResponse = await fetch(url);

    if (!countriesResponse.ok) throw new Error('Failed to fetch data');

    const countries = await countriesResponse.json();

    const countrySelectorElement = document.getElementsByClassName('form-select');

    countries.forEach((country) => {
      const optionElement = document.createElement('option');
      optionElement.value = country.country_id;
      optionElement.innerHTML = `<img src="${country.country_logo}" width="10" height="10"> ${country.country_name}`;
      countrySelectorElement[0].appendChild(optionElement);
    });

  } catch (err) {
    console.log(err);
  }
};


async function fetchLeagueData(countryId) {
  const url = `https://apiv3.apifootball.com/?action=get_leagues&country_id=${countryId}&APIkey=${API_KEY}`;

  const leagues = await fetch(url);
  if (! leagues.ok) throw new Error('failed to fetch data');
  return leagues.json();
}


async function provideLeaguesData() {
  const countrySelectorElement = document.getElementsByClassName('countries')[0];

  countrySelectorElement.addEventListener('change', async () => {
    const selectedOptions = countrySelectorElement.selectedOptions;

    let countryId = "";
    let selectedCountry = "";

    for (const option of selectedOptions) {
      countryId = option.value;
      selectedCountry = option.textContent;
    }

    try {
      const leagueSelector = document.getElementsByClassName('league')[0];

      leagueSelector.innerHTML = "";

      const leagues = await fetchLeagueData(countryId);

      const leagueLabel = document.getElementsByClassName('league-label')[0];
      leagueLabel.innerHTML = `All of League in ${selectedCountry}`;

      leagues.forEach((league) => {
        const leagueOptionElem = document.createElement('option');
        leagueOptionElem.textContent = league.league_name;
        leagueOptionElem.value = league.league_id;
        
        leagueSelector.appendChild(leagueOptionElem);
      });
      
     await provideLeaguesData();

    } catch (err) {
      console.log(err);
    }

  });
}

async function fetchStandingsData(leagueId) {
  const url = `https://apiv3.apifootball.com/?action=get_standings&league_id=${leagueId}&APIkey=${API_KEY}`;

  const standingsResponse = await fetch(url);

  if (!standingsResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  return standingsResponse.json();
}

window.addEventListener('load', showStandingsData);


async function showStandingsData() {
  const leagueSelector = document.getElementsByClassName('league')[0];
  const tableBody = document.getElementsByClassName('standings')[0];

  leagueSelector.addEventListener('change', async () => {
    try {
      tableBody.innerHTML = '';

      const selectedOption = leagueSelector.options[leagueSelector.selectedIndex];
      const leagueId = selectedOption.value;

      const standings = await fetchStandingsData(leagueId);

      if (!Array.isArray(standings) || standings.length === 0) {
        throw new Error('Data is not avaiable');
      }

      standings.forEach(standing => {
        const tr = document.createElement('tr');

        for (let i = 0; i < 6; i++) {
          const td = document.createElement('td');
          if (i === 0) {
            td.innerHTML = `<img src="${standing.team_badge}" width="50" height="50" style="border-radius: 50%; object-fit: cover;">`;
            tr.appendChild(td);
          } else if (i === 1) {
            td.innerText = standing.team_name;
            tr.appendChild(td);
          } else if (i === 2) {
            td.innerText = standing.overall_league_W;
            tr.appendChild(td);
          } else if (i === 3) {
            td.innerText = standing.overall_league_D;
            tr.appendChild(td);
          } else if (i === 4) {
            td.innerText = standing.overall_league_L;
            tr.appendChild(td);
          } else if (i === 5) {
            td.innerText = standing.overall_league_PTS;
            tr.appendChild(td);
          }
        }

        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      window.alert('Data is not avaiable');
      tableBody.innerHTML = '';
    }
  });
}


