import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  PrimaryKey,
  BelongsTo,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from '.';

@Table({
  tableName: 'profiles',
  timestamps: false,
})
export class Profile extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: bigint;

  @Column
  name: string;

  @Column
  age: number;

  @Column(DataType.DATE)
  birthday: Date;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
