import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  namHoc: string

  @Column()
  maHK: number

  @Column()
  tgSV: string

  @Column()
  tgLT: string

  @Column()
  tgGV: string

  @Column()
  tgK: string
}
