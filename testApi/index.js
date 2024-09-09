const url = "https://rickandmortyapi.com/api/character/";

const getCharacterById = async (id = 1) => {
  console.time("getCharacterById");
  let rick = {};
  let response = {};
  await fetch(url + id)
    .then((res) => res.json())
    .then((data) => (rick = data));

  response.name = rick.name;
  response.episode = [];

  for (let i = 0; i < rick.episode.length; i++) {
    console.log("Episodio: ", i);
    const episode = rick.episode[i];
    let episodeResponse = {};
    await fetch(episode)
      .then((res) => res.json())
      .then((data) => (episodeResponse = data));

    let episodeObj = {
      id: episodeResponse.id,
      name: episodeResponse.name,
      characters: []
    };

    for (let j = 0; j < episodeResponse.characters.length; j++) {
      console.log("Personale: ", j, " del episodio: ", i);
      const character = episodeResponse.characters[j];
      let characterResponse = {};
      await fetch(character)
        .then((res) => res.json())
        .then((data) => (characterResponse = data));

      episodeObj.characters.push({
        name: characterResponse.name,
        location: {
          name: characterResponse.location.name
        }
      });
    }

    response.episode.push(episodeObj);
  }

  console.log(JSON.stringify(response));
  console.timeEnd("getCharacterById");
};

getCharacterById(1);
