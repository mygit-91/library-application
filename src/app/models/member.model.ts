export interface Members {
  memberId: string;
  idCard: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface GetMemberByIdCardResponse {
  status: number;
  message: string;
  data: Members;
}
