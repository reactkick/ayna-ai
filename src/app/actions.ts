
"use server";

type Video = {
  title: string;
  url: string;
};

type Emotion = "happy" | "sad" | "thoughtful";

const mockVideos: Record<Emotion, Video[]> = {
  happy: [
    { title: "Joyful Hymns to Lift Your Spirit", url: "https://www.youtube.com/watch?v=aatr_220TzE" },
    { title: "An Inspirational Talk on Finding Gratitude", url: "https://www.youtube.com/watch?v=WPPPF-2wMv0" },
  ],
  sad: [
    { title: "Finding Hope in Moments of Sorrow - A Narrative", url: "https://www.youtube.com/watch?v=k7dmaJ3Oh_c" },
    { title: "Comforting Words for a Heavy Heart", url: "https://www.youtube.com/watch?v=a-n_yG9i8aI" },
  ],
  thoughtful: [
    { title: "A Deeply Reflective Religious Movie Scene", url: "https://www.youtube.com/watch?v=1La4QzGeaaQ" },
    { title: "Meditative Music for Quiet Contemplation", url: "https://www.youtube.com/watch?v=x-elM6I3W4M" },
  ],
};

export async function getYoutubeVideo(emotion: string): Promise<Video> {
  // In a real app, you would use the YouTube Data API here
  // with process.env.YOUTUBE_API_KEY
  console.log(`Searching for a video for emotion: ${emotion}`);
  
  const keywords = ["movie scene", "hymn", "religious narrative", "inspirational speech"];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  const searchQuery = `${emotion} themed inspirational religious ${randomKeyword}`;
  console.log(`Mock search query: ${searchQuery}`);

  const emotionKey = (["happy", "sad", "thoughtful"].includes(emotion) ? emotion : "thoughtful") as Emotion;
  const videoList = mockVideos[emotionKey];
  const selectedVideo = videoList[Math.floor(Math.random() * videoList.length)];

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!selectedVideo) {
    throw new Error("Could not find a suitable video.");
  }

  return selectedVideo;
}
