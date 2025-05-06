import { Router } from 'express';
import * as users from '@handlers/users';
import { validator } from '@middlewares/validations';
import { userProfileSchema } from '@validations/users';

const { register, topMatches, updateProfile } = users;
const router = Router();

router.route('/profile').post(validator(userProfileSchema), register);

router.route('/match/:user_id').get(topMatches);

router.route('/profile/:user_id').patch(updateProfile);

export default router;
