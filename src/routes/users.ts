import { Router } from 'express';
import * as users from '@handlers/users';
import { validator } from "@middlewares/validations";
import { userProfileSchema } from '@validations/users';

const { register, topMatches } = users;
const router = Router();

router.route('/profile').post(validator(userProfileSchema), register);

router.route('/match/:user_id').get(topMatches);

export default router;
