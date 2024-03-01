const API_KEY = 'f9b7a316a8f2f649cc5b313d4e162c9dab12e40d01cd0f0459f2d337d7730454';

const url = {
  getCountry: `https://apiv3.apifootball.com/?action=get_countries&APIkey=${API_KEY}`,
  getCompetitions: `https://apiv3.apifootball.com/?action=get_leagues&country_id=1&APIkey=${API_KEY}`
};


window.addEventListener('load', async (e) => {
  await provideCountriesData();
  updateCompetitions();
});


// Provide Countries Data
async function provideCountriesData() {
  try {

    const countriesResponse = await fetch(url.getCountry);

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

// handle select on change
async function updateCompetitions() {
  const countrySelectorElement = document.getElementsByClassName('countries')[0];
  countrySelectorElement.addEventListener('change', async () => {

    const selectedOptions = countrySelectorElement.selectedOptions;
    let countryId = "1";

    for (const option of selectedOptions) {
      countryId = option.value;
    }
    const url = `https://apiv3.apifootball.com/?action=get_leagues&country_id=${countryId}&APIkey=${API_KEY}`;

    try {
      const competitionsResponse = await fetch(url);
      if (!competitionsResponse.ok) throw new Error('failed to fetch data');

      const competitions = await competitionsResponse.json();

      const tableBody = document.getElementsByClassName('league');

      tableBody[0].innerHTML = '';
      competitions.forEach(competition => {
        const tr = document.createElement('tr');

        tableBody[0].appendChild(tr);
        for (let i = 0; i < 3; i++) {
          const td = document.createElement('td');
          if (i === 0) {
            const isLeagueHasLogo = competition.league_logo ?? 'NA'
            if (! isLeagueHasLogo) {
              td.textContent = 'N/A';
            } else {
              td.innerHTML = `<img src="${competition.league_logo}" width="50" height="50" style="border-radius: 50%; object-fit: cover">`;
            }
            tr.appendChild(td);
          } else if (i === 1) {
            td.textContent = competition.league_name;
            tr.appendChild(td);
          } else if (i === 2) {
            td.textContent = competition.league_season;
            tr.appendChild(td);
          }
        }
      });
      countrySelectorElement.removeEventListener('change', null);
      window.removeEventListener('load', null);
    } catch (err) {
      console.log(err);
    }
  });
}