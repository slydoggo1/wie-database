export enum Role {
  ADMIN = 'Admin',
  STUDENT = 'Student',
  TEACHER = 'Reacher',
}

export interface UserDAO {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  school: string;
}

export const UserSortByOptions = ['firstName', 'lastName', 'role'];
