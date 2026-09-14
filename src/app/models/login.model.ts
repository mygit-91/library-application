export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    token: string;
    staffId: string;
    idCard: string;
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
    isActive: boolean;
  };
}
