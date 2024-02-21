// This structure will be consistent with frontend

export interface UserDTO {
  id: string;
  email: string;
}

export interface GetAllUsersDTO {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UserProfileDTO {
  firstName: string;
  lastName: string;
  school: string;
  email: string;
  role: string;
}
