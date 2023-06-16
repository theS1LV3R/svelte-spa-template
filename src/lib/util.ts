import type { Role, User } from '@prisma/client';
import rfdc from 'rfdc';
import type { BetterOmit, roleCheckModes } from './types';

export const getIdentifier = (name: string) => name.toLowerCase().replaceAll(' ', '_');

// rfdc = Really Fast Deep Clone
export const clone = rfdc({ proto: true, circles: true });

export function exclude<T, Key extends keyof T>(object: T, keys: Key[]): BetterOmit<T, Key> {
  for (const key of keys) {
    delete object[key];
  }
  return object;
}

export const checkRoles = (
  user: BetterOmit<User, 'passwordHash'>,
  roleOrRoles: Role | Role[] | 'ignore',
  mode: roleCheckModes = 'either',
): boolean => {
  if (roleOrRoles === 'ignore') return true;

  if (Array.isArray(roleOrRoles)) {
    switch (mode) {
      case 'exact': {
        let hasAll = true;
        roleOrRoles.forEach((role) => {
          if (!user.roles.includes(role)) hasAll = false;
        });
        return hasAll;
      }
      case 'either': {
        let hasEither = false;
        roleOrRoles.forEach((role) => {
          if (user.roles.includes(role)) hasEither = true;
        });
        return hasEither;
      }
      case 'none': {
        let hasNone = true;
        roleOrRoles.forEach((role) => {
          if (user.roles.includes(role)) hasNone = false;
        });
        return hasNone;
      }
    }
  } else {
    switch (mode) {
      case 'exact': {
        return user.roles.length === 1 && user.roles[0] === roleOrRoles;
      }
      case 'either': {
        return user.roles.includes(roleOrRoles);
      }
      case 'none': {
        return !user.roles.includes(roleOrRoles);
      }
    }
  }
};
