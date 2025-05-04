export const userProfile = {
  AGE: {
    MIN: 18,
    MAX: 100,
    MESSAGE: {
      REQUIRED: 'Age is required',
      MIN: 'Minimum age is 18',
      MAX: 'Maximum age is 100',
    },
  },
  GENDER: {
    VALUES: ['F', 'M'],
    MESSAGE: {
      REQUIRED: 'Gender is required',
      ONE_OF: 'Gender must be either "F" or "M"',
    },
  },
  LOCATION: {
    LAT_MIN: -90,
    LAT_MAX: 90,
    LON_MIN: -180,
    LON_MAX: 180,
    MESSAGE: {
      LAT: 'Latitude must be between -90 and 90',
      LON: 'Longitude must be between -180 and 180',
    },
  },
  INTERESTS: {
    MIN: 1,
    MESSAGE: {
      REQUIRED: 'At least one interest is required',
    },
  },
};
