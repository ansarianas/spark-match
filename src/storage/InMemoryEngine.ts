import * as geohash from 'ngeohash';
import haversine from 'haversine-distance';
import { BadRequestError, NotFoundError } from '@utils/API';
import { Match, Profile } from '@models/profile';

export const ERR_MSG = {
  PROFILE_NOT_EXIST: "Profile doesn't exist!",
  PROFILE_EXIST: 'Profile already exists!',
  GEO_HASH_NOT_FOUND: "Geo hash isn't computed for the given profile!",
};

export class InMemoryEngine {
  private profiles: Map<string, Profile> = new Map();
  private blocks: Map<string, Set<string>> = new Map();
  private dislikes: Map<string, Set<string>> = new Map();
  private geohashes: Map<string, Set<string>> = new Map();
  private matches: Map<string, Match[]> = new Map();

  addProfile(profile: Profile): boolean {
    const {
      id,
      location: { lat, lon },
    } = profile;

    // Check if profile exists
    if (this.profiles.has(id)) throw new BadRequestError(ERR_MSG.PROFILE_EXIST);

    // Geohash calculation
    const hashQuadrant = geohash.encode(lat, lon, 5);
    profile.geohash = hashQuadrant;

    // Store the profile in memory
    this.profiles.set(id, profile);

    // Geohash indexed per quadrant
    if (!this.geohashes.has(hashQuadrant))
      this.geohashes.set(hashQuadrant, new Set());
    this.geohashes.get(hashQuadrant)!.add(id);

    // Match computation
    this.computeMatchScore(id);

    // Recompute matches for nearby profiles to include the new profile
    const nearByProfiles = this.getNearByProfileIds(hashQuadrant);
    for (const nearByProfileId of nearByProfiles) {
      if (nearByProfileId !== id) this.computeMatchScore(nearByProfileId);
    }

    return true;
  }

  getTopMatches(
    profileId: string,
    page: number = 1,
    limit: number = 5,
  ): { matches: Match[]; totalMatchCount: number } {
    // Retrieve the profile from in-memory
    const profile = this.profiles.get(profileId);
    if (!profile) throw new NotFoundError(ERR_MSG.PROFILE_NOT_EXIST);

    // Get precomputed matches for the profile
    const matchList = this.matches.get(profileId) || [];

    // Filter out blocked/disliked/already matched profile
    const topMatches = matchList.filter(
      ({ profileId: matchId }) => !this.isExcluded(profileId, matchId),
    );

    const paginatedMatches = topMatches.slice((page - 1) * limit, page * limit);

    return {
      matches: paginatedMatches,
      totalMatchCount: topMatches.length,
    };
  }

  getProfileById(profileId: string): Profile {
    const profile = this.profiles.get(profileId);
    if (!profile) throw new NotFoundError(ERR_MSG.PROFILE_NOT_EXIST);
    return profile;
  }

  computeMatchScore(profileId: string) {
    // Get the profile of the current user
    const currProfile = this.profiles.get(profileId);
    if (!currProfile) throw new NotFoundError(ERR_MSG.PROFILE_NOT_EXIST);

    // Geohash error handling
    const { geohash } = currProfile;
    const errMsg = `${ERR_MSG.GEO_HASH_NOT_FOUND} ${profileId}`;
    if (!geohash) throw new BadRequestError(errMsg);

    // Get nearby profiles from the same geohash quadrant
    const nearByProfiles = this.getNearByProfileIds(geohash);
    const matchList: Match[] = [];

    // Iterate through each nearby user to compute match score
    for (const nearByProfileId of nearByProfiles) {
      /**
       * Skip iteration if:
       * 1. Profile is same as the current profile
       * 2. Profile is blocked/disliked
       * 3. Nearby profile doesn't exist
       */
      const existingProfile = this.profiles.get(nearByProfileId);
      const isSameProfileId = nearByProfileId === profileId;
      const isExcluded = this.isExcluded(profileId, nearByProfileId);
      if (isSameProfileId || isExcluded || !existingProfile) continue;

      // Calculate the match score and add to list
      const score = this.calculateScore(currProfile, existingProfile);
      if (score >= 15) {
        this.addMatch(profileId, nearByProfileId, score);
        matchList.push({ profileId: nearByProfileId, score });
      }
    }

    // Sort the matches by score in desc order
    matchList.sort((a, b) => b.score - a.score);

    // Store the sorted match list for the profile
    this.matches.set(profileId, matchList);
  }

  totalRegisteredProfiles() {
    return this.profiles.size;
  }

  private calculateScore(profile1: Profile, profile2: Profile): number {
    const { interests: p1Int, age: p1Age, location: p1Loc } = profile1;
    const { interests: p2Int, age: p2Age, location: p2Loc } = profile2;

    // Compute age score - 10 points to be alloted at max
    const ageDiff = Math.abs(p1Age - p2Age);
    const ageScore = Math.max(0, 10 - ageDiff);

    // Compute interest score - 1 interest weighs 5 points
    const sharedInterests = p1Int.filter((i) => p2Int.includes(i)).length;
    const interestScore = sharedInterests * 5;

    // Compute proximity score - Max 10 points if within 1km, if distance > 10km set 0 points
    const distanceMeters = haversine(p1Loc, p2Loc);
    const distanceKm = distanceMeters / 1000;
    const proximityScore = Math.max(0, 10 - distanceKm);

    return interestScore + ageScore + proximityScore;
  }

  private getNearByProfileIds(hashQuadrant: string): Set<string> {
    const nearbyIds = new Set<string>();
    const neighbors = geohash.neighbors(hashQuadrant);
    neighbors.push(hashQuadrant);

    for (const hash of neighbors) {
      const ids = this.geohashes.get(hash);
      if (ids) {
        for (const id of ids) nearbyIds.add(id);
      }
    }

    return nearbyIds;
  }

  private isExcluded(profileId1: string, profileId2: string): boolean {
    const blocked = this.blocks.get(profileId1)?.has(profileId2) || false;
    const disliked = this.dislikes.get(profileId1)?.has(profileId2) || false;

    return blocked || disliked;
  }

  private addMatch(profileId: string, matchId: string, score: number): void {
    const match: Match = { profileId: matchId, score };
    const existingMatches = this.matches.get(profileId) || [];
    existingMatches.push(match);
    this.matches.set(profileId, existingMatches);
  }

  //#region Only used for test cases
  __test_addBlock(profileId1: string, profileId2: string): void {
    if (!this.blocks.has(profileId1)) this.blocks.set(profileId1, new Set());
    this.blocks.get(profileId1)!.add(profileId2);
  }

  __test_addDislike(profileId1: string, profileId2: string): void {
    if (!this.dislikes.has(profileId1))
      this.dislikes.set(profileId1, new Set());
    this.dislikes.get(profileId1)!.add(profileId2);
  }

  __test_unBlock(profileId1: string, profileId2: string): void {
    this.blocks.get(profileId1)?.delete(profileId2);
  }

  __test_unDislike(profileId1: string, profileId2: string): void {
    this.dislikes.get(profileId1)?.delete(profileId2);
  }
  //#endregion
}
