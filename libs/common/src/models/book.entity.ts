import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../database';

@Entity()
export class Book extends AbstractEntity<Book> {
  @Column()
  name: string;

  @Column()
  author: string;

  @Column()
  quantity: number;
}
