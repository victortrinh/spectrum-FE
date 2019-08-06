export class LastFmAPI {
  getTopTags = async () => {
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=a09702ee21fe630efc366adf3c546342&format=json`
    );

    return await response.json();
  };
}
