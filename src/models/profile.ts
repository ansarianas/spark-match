interface Coordinates {
  lat: number;
  lon: number;
}

export interface Profile {
  id: string;
  age: number;
  gender: string;
  location: Coordinates;
  interests: string[];
  geohash?: string;
}

export interface Match {
  profileId: string;
  score: number;
}
