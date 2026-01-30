/* eslint-disable prettier/prettier */
import { ProductModel } from '@/products/domain/models/poducts.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class Product implements ProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
