import { faker } from '@faker-js/faker';
import { InMemoryEngine } from '@storage/InMemoryEngine';
import { Profile } from '@models/profile';

const interestsPool = [
  'music',
  'sports',
  'reading',
  'travel',
  'movies',
  'art',
  'coding',
  'gaming',
];

function getRandomInterests(): string[] {
  const shuffled = faker.helpers.shuffle(interestsPool);
  return shuffled.slice(0, faker.number.int({ min: 2, max: 5 }));
}

export function seedProfiles(
  count: number = 100,
  engine: InMemoryEngine,
): void {
  for (let i = 0; i < count; i++) {
    const profile: Profile = {
      id: `user${i + 1}`,
      age: faker.number.int({ min: 18, max: 45 }),
      gender: faker.helpers.arrayElement(['M', 'F']),
      location: {
        lat: faker.location.latitude({ min: 28.5, max: 29 }),
        lon: faker.location.longitude({ min: 77, max: 77.5 }),
      },
      interests: getRandomInterests(),
    };

    try {
      engine.addProfile(profile);
    } catch (error: any) {
      console.error(`Error for user${i + 1} - ${error.detail}`);
    }
  }
}

if (require.main === module) {
  const engine: InMemoryEngine = new InMemoryEngine();
  const count = parseInt(process.argv[2] || '100');
  seedProfiles(count, engine);
  const totalProfiles = engine.totalRegisteredProfiles();
  console.log('Total Seeded Profiles - ', totalProfiles);
}
