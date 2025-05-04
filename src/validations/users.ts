import { object, string, number, array } from 'yup';
import { userProfile } from '@constants/user-validations';

const { AGE, GENDER, LOCATION, INTERESTS } = userProfile;

export const userProfileSchema = object({
  age: number()
    .required(AGE.MESSAGE.REQUIRED)
    .min(AGE.MIN, AGE.MESSAGE.MIN)
    .max(AGE.MAX, AGE.MESSAGE.MAX),

  gender: string()
    .required(GENDER.MESSAGE.REQUIRED)
    .oneOf(GENDER.VALUES, GENDER.MESSAGE.ONE_OF),

  location: object({
    lat: number()
      .required(LOCATION.MESSAGE.LAT)
      .min(LOCATION.LAT_MIN)
      .max(LOCATION.LAT_MAX),
    lon: number()
      .required(LOCATION.MESSAGE.LON)
      .min(LOCATION.LON_MIN)
      .max(LOCATION.LON_MAX),
  }),

  interests: array()
    .of(string())
    .required(INTERESTS.MESSAGE.REQUIRED)
    .min(INTERESTS.MIN, INTERESTS.MESSAGE.REQUIRED),
});
