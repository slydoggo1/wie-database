export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    school: string;
}

export interface UserDTO {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    school: string;
    role: string;
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
