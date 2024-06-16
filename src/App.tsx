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
    artistDisplayName: string;
    objectDate: string;
    medium: string;
    dimensions: string;
    objectURL: string;
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

        const artworkData: Artwork = (await response.json()) as Artwork;
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
    <div className="body-container">
      <div className="image-container">
        <h1>{artwork.title}</h1>
        {artwork.primaryImage ? (
          artwork.primaryImageSmall ? (
            <img src={artwork.primaryImageSmall} alt={artwork.title} />
          ) : (
            <img src={artwork.primaryImage} alt={artwork.title} />
          )
        ) : null}
        {/* <p className="artwork-details">{artwork.artistDisplayName}</p> */}

        <div className="artwork-details">
          {artwork.artistDisplayName && (
            <p>
              <span className="label">Artist:</span> {artwork.artistDisplayName}
            </p>
          )}
          {artwork.objectDate && (
            <p>
              <span className="label">Date:</span> {artwork.objectDate}
            </p>
          )}
          {artwork.medium && (
            <p>
              <span className="label">Medium:</span> {artwork.medium}
            </p>
          )}
          {artwork.objectURL && <a href={artwork.objectURL}>Learn More</a>}
        </div>
      </div>
    </div>
  );
}

export default App;
