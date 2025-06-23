// chat-session.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('chat_sessions')
export class ChatSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionName?: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  lastActivity: Date;

  @OneToMany(() => Chat, (chat) => chat.session, { cascade: true })
  chats: Chat[];
}
