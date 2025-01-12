import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../database/abstract.entity';
import { Role } from './role.entity';
import { Bookstore } from './bookstores.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles?: Role[];

  @ManyToOne(() => Bookstore, (bookstore) => bookstore.managers, {
    nullable: true,
  })
  bookstore: Bookstore;
}
