import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['user', 'date'], { unique: true })
export class UserUsage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: 0 })
  totalInputTokens: number;

  @Column({ default: 0 })
  totalOutputTokens: number;

  @Column({ type: 'float', default: 0 })
  totalPointsUsed: number;

  @Column({ default: 0 })
  messageCount: number;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.usages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
