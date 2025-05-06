import { InMemoryEngine, ERR_MSG } from '@storage/InMemoryEngine';
import { BadRequestError, NotFoundError } from '@utils/API';
import { profile1, profile2, profile3 } from './mock-profiles';

let engine: InMemoryEngine;

beforeAll(() => {
  engine = new InMemoryEngine();
});

describe('InMemoryEngine Tests', () => {
  it('should add a profile and retrieve it by ID', () => {
    engine.addProfile(profile1);

    const retrievedProfile = engine.getProfileById('user1');

    expect(retrievedProfile).toBeDefined();
    expect(retrievedProfile.id).toBe('user1');
    expect(retrievedProfile.age).toBe(25);
  });

  it('should throw an error if profile already exists', () => {
    const error = new BadRequestError(ERR_MSG.PROFILE_EXIST);

    expect(() => engine.addProfile(profile1)).toThrow(error);
  });

  it('should compute match score correctly for two profiles', () => {
    engine.addProfile(profile2);

    const { matches } = engine.getTopMatches('user1', 1, 2);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].profileId).toBe('user2');
  });

  it('should exclude blocked profiles from matches', () => {
    engine.__test_addBlock('user1', 'user2');

    const { matches } = engine.getTopMatches('user1', 1, 2);

    expect(matches.length).toBe(0);
  });

  it('should exclude disliked profiles from matches', () => {
    engine.__test_addDislike('user1', 'user2');

    const { matches } = engine.getTopMatches('user1', 1, 2);

    expect(matches.length).toBe(0);
  });

  it('should compute geohash and include nearby profiles', () => {
    engine.__test_unBlock('user1', 'user2');
    engine.__test_unDislike('user1', 'user2');
    engine.addProfile(profile3);

    const { matches: matches1 } = engine.getTopMatches('user1', 1, 2);
    const { matches: matches2 } = engine.getTopMatches('user2', 1, 2);

    expect(matches1[0].profileId).toBe('user2');
    expect(matches2[0].profileId).toBe('user1');
  });

  it('should paginate matches correctly', () => {
    const { matches } = engine.getTopMatches('user1', 1, 1);

    expect(matches.length).toBe(1);
    expect(matches[0].profileId).toBe('user2');
  });

  it('should throw error if profile does not exist', () => {
    const error = new NotFoundError(ERR_MSG.PROFILE_NOT_EXIST);
    expect(() => engine.getProfileById('user100')).toThrow(error);
  });
});
