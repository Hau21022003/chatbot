import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
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
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.FREE,
  })
  userType: UserType;

  @Column({ nullable: true, default: 'user' })
  role: 'admin' | 'user';

  @Column({ type: 'float', default: 0 })
  remainingPoints: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => ChatSession, (chat) => chat.user, { cascade: true })
  chatSessions: ChatSession[];

  @OneToMany(() => UserUsage, (usage) => usage.user, { cascade: true })
  usages: UserUsage[];
}
