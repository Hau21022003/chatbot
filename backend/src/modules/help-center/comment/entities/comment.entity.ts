import { Transform } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { getDownloadUrls } from 'src/common/utils/url.utils';
import { CommentReaction } from 'src/modules/help-center/comment/entities/comment-reaction.entity';
import { Question } from 'src/modules/help-center/question/entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Transform(({ value }) => getDownloadUrls(value))
  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column()
  authorId: string;

  @Column()
  questionId: number;

  @ManyToOne(() => Question, (question) => question.comments, {
    onDelete: 'CASCADE',
  })
  question: Question;

  // @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => CommentReaction, (reaction) => reaction.comment)
  reactions: CommentReaction[];

  likeCount: number = 0;
  dislikeCount: number = 0;
  isLikedByCurrentUser: boolean = false;
  isDislikedByCurrentUser: boolean = false;
}
