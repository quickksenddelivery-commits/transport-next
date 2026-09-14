import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

export const hashPassword = (plain: string) => bcrypt.hash(plain, 12);

export const comparePassword = (candidate: string, hash: string) => bcrypt.compare(candidate, hash);

export const isLocked = (user: Pick<User, 'lockUntil'>) =>
  !!(user.lockUntil && user.lockUntil.getTime() > Date.now());

export const fullName = (user: Pick<User, 'firstName' | 'lastName'>) =>
  `${user.firstName} ${user.lastName}`;

// Returns the Prisma `data` patch to apply on a failed login attempt —
// mirrors the old Mongoose incLoginAttempts() method.
export const loginAttemptPatch = (
  user: Pick<User, 'loginAttempts' | 'lockUntil'>
): { loginAttempts: number; lockUntil: Date | null } => {
  if (user.lockUntil && user.lockUntil.getTime() < Date.now()) {
    return { loginAttempts: 1, lockUntil: null };
  }
  const loginAttempts = user.loginAttempts + 1;
  const lockUntil =
    loginAttempts >= 5 && !isLocked(user) ? new Date(Date.now() + 30 * 60 * 1000) : user.lockUntil;
  return { loginAttempts, lockUntil };
};

export const sanitizeUser = (user: User) => {
  const { password: _password, loginAttempts: _loginAttempts, lockUntil: _lockUntil, ...safe } = user;
  return safe;
};
