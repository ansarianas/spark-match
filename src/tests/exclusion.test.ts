import { InMemoryEngine } from '@storage/InMemoryEngine';
import { profile1, profile2, profile3 } from './mock-profiles';

let engine: InMemoryEngine;

beforeEach(() => {
  engine = new InMemoryEngine();
});

describe('Exclusion Test', () => {
  it('should block a profile and exclude it from match list', () => {
    engine.addProfile(profile1);
    engine.addProfile(profile2);
    engine.addProfile(profile3);

    engine.__test_addBlock('user1', 'user2');

    const { matches } = engine.getTopMatches('user1');

    expect(matches).not.toContainEqual(
      expect.objectContaining({ profileId: 'user2' }),
    );
  });

  it('should dislike a profile and exclude it from match list', () => {
    engine.addProfile(profile1);
    engine.addProfile(profile2);

    engine.__test_addDislike('user1', 'user2');

    const { matches } = engine.getTopMatches('user1');

    expect(matches).not.toContainEqual(
      expect.objectContaining({ profileId: 'user2' }),
    );
  });

  it('should exclude blocked and disliked profiles from match list', () => {
    engine.addProfile(profile1);
    engine.addProfile(profile2);
    engine.addProfile(profile3);

    engine.__test_addBlock('user1', 'user2');
    engine.__test_addDislike('user1', 'user3');

    const { matches } = engine.getTopMatches('user1');

    expect(matches).not.toContainEqual(
      expect.objectContaining({ profileId: 'user2' }),
    );
    expect(matches).not.toContainEqual(
      expect.objectContaining({ profileId: 'user3' }),
    );
  });
});
