import { InMemoryEngine } from '@storage/InMemoryEngine';
import { profile1, profile2 } from './mock-profiles';

let engine: InMemoryEngine;

beforeEach(() => {
  engine = new InMemoryEngine();
});

describe('Match scoring test', () => {
  it('should calculate score correctly', () => {
    engine.addProfile(profile1);
    engine.addProfile(profile2);

    const score = engine.__test_calculateScore(profile1, profile2);
    expect(score).toBeGreaterThan(0);
  });
});
