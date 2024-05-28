type DecodedUserToken = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type { DecodedUserToken };
