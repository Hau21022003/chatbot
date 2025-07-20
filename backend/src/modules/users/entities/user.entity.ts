import { Exclude, Transform } from 'class-transformer';
import { getDownloadUrl } from 'src/common/utils/url.utils';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { Comment } from 'src/modules/help-center/comment/entities/comment.entity';
import { Question } from 'src/modules/help-center/question/entities/question.entity';
import { UserUsage } from 'src/modules/usage/entities/user-usage.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum UserType {
  FREE = 'free',
  ENTERPRISE = 'enterprise',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  @Transform(({ value }) => getDownloadUrl(value))
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.FREE,
  })
  userType: UserType;

  @Column({ type: 'timestamp', nullable: true })
  enterpriseExpiresAt: Date;

  @Column({ nullable: true, default: 'user' })
  role: 'admin' | 'user';

  @Column({ type: 'float', default: 0 })
  remainingPoints: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => ChatSession, (chat) => chat.user, { cascade: true })
  chatSessions: ChatSession[];

  @OneToMany(() => UserUsage, (usage) => usage.user, { cascade: true })
  usages: UserUsage[];
}
