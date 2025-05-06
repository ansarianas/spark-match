import { Request, Response } from 'express';
import { HttpCodes, HttpMethods } from '@constants/http';
import { asyncHandler } from '@utils/helper';
import { successHandler } from '@utils/response';
import { BadRequestError } from '@utils/API';
import { engine } from '../server';

/**
 * @public POST /api/user/profile
 */
export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { body } = req;

    engine.addProfile(body);

    const successMsg = 'User is now registered!';
    const data = { success: true, userId: body.id };
    const response = successHandler(successMsg, HttpCodes.CREATED.code, data);

    return res.status(res.statusCode).send(response);
  },
  {
    apiEndpoint: '/api/user/profile',
    method: HttpMethods.POST,
  },
);

/**
 * @public GET /api/user/match/:user_id
 */
export const topMatches = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      params: { user_id },
      query,
    } = req;
    const limit = parseInt(query.limit as string) || 5;
    const page = parseInt(query.page as string) || 1;

    if (!user_id) {
      throw new BadRequestError('User id is required!');
    }

    const { matches, totalMatchCount } = engine.getTopMatches(
      user_id,
      page,
      limit,
    );

    const matchProfiles = matches.map(({ profileId, score }) => {
      const profile = engine.getProfileById(profileId);
      return { ...profile, score };
    });

    const successMsg = 'Top matches fetched!';
    const data = {
      success: true,
      totalMatchCount,
      matches: matchProfiles,
    };
    const response = successHandler(successMsg, HttpCodes.OK.code, data);

    return res.status(res.statusCode).send(response);
  },
  {
    apiEndpoint: '/api/user/match/:user_id',
    method: HttpMethods.POST,
  },
);

/**
 * @public PATCH /api/user/profile/:user_id
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      body,
      params: { user_id },
    } = req;

    if (!body) {
      throw new BadRequestError('Body is missing!');
    }
  
    engine.updateProfile(user_id, body);
  
    const successMsg = 'User profile is now udpated!';
    const data = { success: true };
    const response = successHandler(successMsg, HttpCodes.OK.code, data);

    return res.status(res.statusCode).send(response);
  },
  {
    apiEndpoint: '/api/user/profile/:user_id',
    method: HttpMethods.PATCH,
  },
);
