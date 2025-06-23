import { BaseEntity } from 'src/common/entities/base.entity';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chats')
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column()
  sender: 'user' | 'bot';

  @Column()
  sessionId: string;

  @ManyToOne(() => ChatSession, (session) => session.chats)
  @JoinColumn({ name: 'sessionId' })
  session: ChatSession;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    images: string[];
  };
}
