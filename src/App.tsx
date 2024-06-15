import "./App.css";
import { useState, useEffect } from "react";
import metObjectsWithImages from "./assets/met-objects-q-paint.json";
function App() {
  // Current metObjectsWithImages is from https://collectionapi.metmuseum.org/public/collection/v1/search?q=paint&hasImages=true

  interface Artwork {
    title: string;
    primaryImage: string;
    primaryImageSmall: string;
    objectID: number;
  }

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      const artworkID = generateRandomMetObjectID();
      try {
        const response = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkID}`
        );

        const artworkData: Artwork = (await response.json()) as object;
        setArtwork(artworkData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    if (isLoading) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchArtwork();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function generateRandomMetObjectID(): number {
    const randomIndex: number = Math.floor(
      Math.random() * metObjectsWithImages.total
    );
    return metObjectsWithImages.objectIDs[randomIndex];
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!artwork) {
    return <div>Error: Unable to fetch data</div>;
  }

  return (
    <>
      <div>{artwork.title}</div>
      {artwork.primaryImage ? (
        artwork.primaryImageSmall ? (
          <img src={artwork.primaryImageSmall} alt={artwork.title} />
        ) : (
          <img src={artwork.primaryImage} alt={artwork.title} />
        )
      ) : null}
    </>
  );
}

export default App;
