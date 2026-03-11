export interface LoginResponseBody {
  token: string;
  type: string;
  username: string;
  role: string;
  expiresIn: number;
}
