export interface AuthSession {
  token: string;
  type: string;
  username: string;
  role: string;
  expiresAt: number | null;
}
