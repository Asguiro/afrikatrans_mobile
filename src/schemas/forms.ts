import {z} from 'zod';

export const registerIdentitySchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
});

export const registerPhoneSchema = z.object({
  countryCode: z.string().min(2, 'Pays requis'),
  nationalNumber: z.string().min(8, 'Numéro invalide'),
});

export const registerPasswordSchema = z
  .object({
    password: z.string().min(6, 'Au moins 6 caractères'),
    confirmPassword: z.string().min(6, 'Confirmez le mot de passe'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const registerSchema = z.object({
  countryCode: z.string().min(2),
  phone: z.string().min(8, 'Numéro invalide'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

export const loginSchema = z.object({
  countryCode: z.string().min(2, 'Pays requis'),
  nationalNumber: z.string().min(8, 'Numéro invalide'),
  password: z.string().min(6, 'Mot de passe requis'),
});

export const otpSchema = z.object({
  code: z.string().length(6, 'OTP à 6 chiffres'),
});

export const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, 'PIN 4 à 6 chiffres'),
});

export const amountSchema = z.object({
  amount: z.number().positive('Montant requis'),
});

export const beneficiarySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(8),
  countryCode: z.string().min(2),
  operatorId: z.string().min(1),
});

export const kycPersonalSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  addressLine: z.string().min(3),
  city: z.string().min(2),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z
    .string()
    .trim()
    .refine(value => value === '' || z.email().safeParse(value).success, {
      message: 'E-mail invalide',
    }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Mot de passe actuel requis'),
    newPassword: z.string().min(6, 'Au moins 6 caractères'),
    confirmPassword: z.string().min(6, 'Confirmez le mot de passe'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
  .refine(data => data.newPassword !== data.currentPassword, {
    message: 'Le nouveau mot de passe doit être différent',
    path: ['newPassword'],
  });

const WEAK_PINS = new Set(['0000', '1111', '1234', '4321', '1212', '2222']);

function isWeakPin(pin: string): boolean {
  if (WEAK_PINS.has(pin)) {
    return true;
  }
  return pin.length >= 4 && new Set(pin.split('')).size === 1;
}

export const changePinSchema = z
  .object({
    currentPin: z.string().regex(/^\d{4,6}$/, 'PIN actuel invalide'),
    newPin: z.string().regex(/^\d{4,6}$/, 'PIN 4 à 6 chiffres'),
    confirmPin: z.string().regex(/^\d{4,6}$/, 'Confirmez le PIN'),
  })
  .refine(data => data.newPin === data.confirmPin, {
    message: 'Les PIN ne correspondent pas',
    path: ['confirmPin'],
  })
  .refine(data => data.newPin !== data.currentPin, {
    message: 'Le nouveau PIN doit être différent',
    path: ['newPin'],
  })
  .refine(data => !isWeakPin(data.newPin), {
    message: 'Choisissez un PIN plus difficile à deviner',
    path: ['newPin'],
  });
