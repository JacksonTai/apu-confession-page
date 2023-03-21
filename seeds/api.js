const axios = require('axios');
const path = require('path');
const fs = require('fs');

const seedAPI = async (count, api) => {
  try {
    console.log(`Seeding API: ${api} ...`);

    // Axios configuration.
    const config = {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'axios 0.27.2',
      },
    };

    // Request API data and store in an array.
    const confessions = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= count; i++) {
      const res = await axios.get(api, config);
      confessions.push({
        _id: i + 2000,
        time: new Date().toISOString(),
        content: res.data.joke,
        status: 'Pending',
      });
    }

    // Write data to JSON file.
    fs.writeFile(
      path.join(__dirname, 'confessions.json'),
      JSON.stringify(confessions),
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('API Seeding Completed - ✔️');
        }
      },
    );
  } catch (error) {
    console.error(error);
  }
};

seedAPI(30, 'https://icanhazdadjoke.com/');
