import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

  @Column({ nullable: true, default: 'user' })
  role: 'admin' | 'user';

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => ChatSession, (chat) => chat.user, { cascade: true })
  chatSessions: ChatSession[];
}
