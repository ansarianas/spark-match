import * as geohash from 'ngeohash';
import { InMemoryEngine } from '@storage/InMemoryEngine';
import { profile1, profile2 } from './mock-profiles';

let engine: InMemoryEngine;

beforeEach(() => {
  engine = new InMemoryEngine();
});

describe('Geo hash Test', () => {
  it('should calculate geo hash for the profile and store it', () => {
    engine.addProfile(profile1);

    const storedProfile = engine.getProfileById('user1');

    expect(storedProfile.geohash).toBeDefined();
  });

  it('should store the profile in the correct geo hash quadrant', () => {
    const {
      location: { lat: p1Lat, lon: p1Lon },
    } = profile1;
    const {
      location: { lat: p2Lat, lon: p2Lon },
    } = profile1;
    engine.addProfile(profile1);
    engine.addProfile(profile2);

    const geoHash1 = geohash.encode(p1Lat, p1Lon, 5);
    const geoHash2 = geohash.encode(p2Lat, p2Lon, 5);

    expect(engine.__test_nearByProfile(geoHash1)).toContain('user1');
    expect(engine.__test_nearByProfile(geoHash2)).toContain('user2');
  });
});
