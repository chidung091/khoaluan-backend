import { Class } from 'src/modules/class/entity/class.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  courseId: number

  @Column({ type: 'nvarchar', length: '50' })
  courseName: string

  @Column()
  courseStartTime: number

  @Column()
  courseEndTime: number

  @OneToMany(() => Class, (project) => project.classDepartment)
  classes: Class[]

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
