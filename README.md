# Spark Match ⚡️

A fast, in-memory matchmaking engine designed to find compatible profiles based on several factors, including age similarity, shared interests, and location proximity.

## 🧠 Architecture Overview

The core of the app is the **InMemoryEngine** class. It holds:
* Map<string, Profile> = Stores user profiles.
* Map<string, Set<string>> = Stores geohash indexed per quadrant, blocked/disliked profiles for each profile Ids.
* Map<string, Match[]> = Stores precomputed matches per profile.

    ### Key Design Choices
    * Geohash (precision: 5) used to group users into location zones for fast proximity filtering.
    * Match score is precomputed at profile creation/update.
    * Scores are a sum of:
        * Interest Match (5 points per interest match)
        * Age Similarity (up to 10 points)
        * Proximity (up to 10 points for within 1km)
        * Only scores >= 15 are considered as matches.

## ⚡️Pre-computation Strategy
* When a profile is added or updated:
    * Compute the geohash and store it.
    * Immediately compute match scores with all nearby profiles (same geohash + neighbors).
* Filter out:
    * Same profile.
    * Blocked/disliked profiles.
    * Already matched profiles.
* Store the list sorted by descending score for quick pagination reads.
* This ensures GET operation (getTopMatches) are O(1) for reads and only need slicing.

## 🏭 If this went to production
* Replace Map with Redis or a real DB with TTL.
* Persist profiles in a DB and cache top matches with invalidation triggers.
* Move precomputation logic to background jobs or workers.
* Add proper monitoring and alerting incase of logic failure.

## 🚀 Run / Build / Test

### Install dependencies
```
npm install
```
### Run server (dev)
```
npm run dev
```

## Build (production)
```
npm run build
```

## Run tests
```
npm test
```