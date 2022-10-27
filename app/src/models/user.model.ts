import {
  Table,
  Column,
  Model,
  HasOne,
  AutoIncrement,
  PrimaryKey,
  Unique,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Profile } from '.';
import { hashPassword } from '../utils/hash-password';

@Table({
  timestamps: false,
  tableName: 'users',
})
export class User extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: bigint;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @HasOne(() => Profile)
  profile: Profile;

  @BeforeCreate
  @BeforeUpdate
  static hashPass(user: User) {
    user.setDataValue('password', hashPassword(user.password));
  }
}
