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
