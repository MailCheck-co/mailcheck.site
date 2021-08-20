const fetchData = async () => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?playlistId=PLI3Dd_Z__sqcUmD8MaIFMIVnfEvTtyPZg&part=snippet&key=${apiKey}`;
  const headers = { accept: 'application/json' };
  try {
    return fetch(url, { headers }).then((response) => response.json());
  } catch (error) {
    console.error('Error fetching youtube: ' + error);
  }
};

export default fetchData;
