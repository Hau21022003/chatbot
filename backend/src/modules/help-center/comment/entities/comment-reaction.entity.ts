import { BaseEntity } from 'src/common/entities/base.entity';
import { Comment } from 'src/modules/help-center/comment/entities/comment.entity';
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
@Index(['userId', 'commentId'], { unique: true })
export class CommentReaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column({ type: 'enum', enum: ['like', 'dislike'] })
  type: 'like' | 'dislike';
}
