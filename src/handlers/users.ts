import { Request, Response } from 'express';
import { HttpCodes, HttpMethods } from '@constants/http';
import { asyncHandler } from '@utils/helper';
import { successHandler } from '@utils/response';

/**
 * @public POST /api/user/profile
 */
export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const { body } = req;

    /**
     * TODO:
     * 1. Save user in-memory & assign geo hash quadrant
     * 2. Precompute match
     * 3. Should be stored and indexed per quadrant
     */

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
    } = req;

    /**
     * TODO: Returns top 5 matches
     * 1. Include (Age, Interest, Location proximity)
     * 2. Exclude (Blocked user, disliked user, matched user
     */

    const successMsg = 'Top matches fetched!';
    const data = { success: true, user_id: `User id is ${user_id}` };
    const response = successHandler(successMsg, HttpCodes.OK.code, data);

    return res.status(res.statusCode).send(response);
  },
  {
    apiEndpoint: '/api/user/match/:user_id',
    method: HttpMethods.POST,
  },
);
