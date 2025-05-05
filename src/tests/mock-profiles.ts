import { Profile } from '../models/profile';

export const profile1: Profile = {
  id: 'user1',
  age: 25,
  gender: 'M',
  location: { lat: 40.7128, lon: -74.006 },
  interests: ['sports'],
};

export const profile2: Profile = {
  id: 'user2',
  age: 24,
  gender: 'F',
  location: { lat: 40.7128, lon: -74.0059 },
  interests: ['music'],
};

export const profile3: Profile = {
  id: 'user3',
  age: 22,
  gender: 'M',
  location: { lat: 40.8, lon: -74.05 },
  interests: ['art'],
};
