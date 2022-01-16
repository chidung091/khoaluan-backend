import { Department } from 'src/modules/department/entity/department.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import { Role } from '../users.enum'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userID: number

  @Column()
  password: string

  @Column({ unique: true })
  email: string

  @Column({ type: 'enum', enum: Role })
  role: Role

  @Column({ nullable: true })
  imageUrls: string

  @OneToMany(() => Department, (project) => project.departmentAdmin)
  departments: Department[]

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date
}
