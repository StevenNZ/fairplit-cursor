// User interface
export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  // Auth request interfaces
  export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  // Auth response interface
  export interface AuthResponse {
    token: string;
    user: User;
  }