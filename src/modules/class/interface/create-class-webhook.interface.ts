export interface ICreateClassWebhook {
  classId: number
  courseId: number
  students: IStudents[]
}

export interface IStudents {
  semester: number
  studentsIds: Array<number>
  startYear: number
  endYear: number
  headMasterId: number
}

export interface IClassIds {
  classIds: Array<number>
}

export interface IClassId {
  classId: number
}

export interface IClassResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  classId: number
  courseId: number
  students: IStudents[]
}
