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

export enum SenderType {
  USER = 'user',
  BOT = 'bot',
}

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  NONE = 'none',
}

@Entity('chats')
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: SenderType,
  })
  sender: SenderType;

  @Column({
    type: 'enum',
    enum: ReactionType,
    default: ReactionType.NONE,
  })
  reaction: ReactionType;

  @Column()
  sessionId: string;

  @ManyToOne(() => ChatSession, (session) => session.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session: ChatSession;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    images: string[];
  };
}
