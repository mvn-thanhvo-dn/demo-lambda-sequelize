import { sequelize } from '../shared/configs/database';
import { User, Profile } from '../models';

export const userRepository = sequelize.getRepository(User);
export const profileRepository = sequelize.getRepository(Profile);
