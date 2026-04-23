import YTMusic from "ytmusic-api";
const ytmusic = new YTMusic();

async function run() {
  await ytmusic.initialize();
  const songs = await ytmusic.searchSongs("shape of you");
  console.log(songs[0]);
}

run();
