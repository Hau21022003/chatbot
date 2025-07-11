import { BaseEntity } from 'src/common/entities/base.entity';
import { Comment } from 'src/modules/help-center/comment/entities/comment.entity';
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
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  pinned: boolean;

  @Column()
  authorId: string;

  // @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.question, {
    cascade: true,
  })
  comments: Comment[];
}
