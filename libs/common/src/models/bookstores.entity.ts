import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '../database';
import { Book } from './book.entity';
import { User } from './users.entity';

@Entity()
export class Bookstore extends AbstractEntity<Bookstore> {
  @Column()
  name: string;

  @ManyToMany(() => Book, { cascade: true })
  @JoinTable()
  books?: Book[];

  @OneToMany(() => User, (user) => user.bookstore)
  managers: User[];
}
