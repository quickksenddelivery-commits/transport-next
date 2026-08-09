import { AppError } from './errorHandler';

export type FieldError = { field: string; message: string };

export class ValidationError extends AppError {
  errors: FieldError[];

  constructor(errors: FieldError[]) {
    super('Validation failed', 422, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

type Value = unknown;

const getPath = (obj: unknown, path: string): Value => {
  const b = (obj ?? {}) as Record<string, unknown>;
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, b);
};

const isPresent = (value: Value): boolean =>
  value !== undefined && value !== null && !(typeof value === 'string' && value.trim() === '');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONGO_ID_RE = /^[0-9a-fA-F]{24}$/;

export type Rule =
  | { kind: 'required'; field: string; message: string }
  | { kind: 'email'; field: string; message: string }
  | { kind: 'float'; field: string; message: string; min?: number; max?: number }
  | { kind: 'enum'; field: string; message: string; values: readonly string[] }
  | { kind: 'mongoId'; field: string; message: string }
  | { kind: 'custom'; field: string; message: string; test: (body: unknown) => boolean };

export const required = (field: string, message: string): Rule => ({ kind: 'required', field, message });
export const isEmail = (field: string, message: string): Rule => ({ kind: 'email', field, message });
export const isFloat = (field: string, message: string, opts?: { min?: number; max?: number }): Rule => ({
  kind: 'float',
  field,
  message,
  ...opts,
});
export const isIn = (field: string, values: readonly string[], message: string): Rule => ({
  kind: 'enum',
  field,
  message,
  values,
});
export const isMongoId = (field: string, message: string): Rule => ({ kind: 'mongoId', field, message });
export const customRule = (field: string, message: string, test: (body: unknown) => boolean): Rule => ({
  kind: 'custom',
  field,
  message,
  test,
});

export const validate = (body: unknown, rules: Rule[]): FieldError[] => {
  const errors: FieldError[] = [];

  for (const rule of rules) {
    const value = getPath(body, rule.field);
    const errorsFor = (message: string) => errors.push({ field: rule.field, message });

    switch (rule.kind) {
      case 'required':
        if (!isPresent(value)) errorsFor(rule.message);
        break;
      case 'email': {
        const v = typeof value === 'string' ? value.trim() : value;
        if (v !== undefined && v !== '' && !EMAIL_RE.test(String(v))) errorsFor(rule.message);
        break;
      }
      case 'float': {
        const v = typeof value === 'string' ? value.trim() : value;
        if (v === undefined || v === '' || v === null) break;
        const num = Number(v);
        if (!Number.isFinite(num)) {
          errorsFor(rule.message);
        } else {
          if (rule.min !== undefined && num < rule.min) errorsFor(rule.message);
          if (rule.max !== undefined && num > rule.max) errorsFor(rule.message);
        }
        break;
      }
      case 'enum': {
        const v = typeof value === 'string' ? value.trim() : value;
        if (v === undefined || v === '') break;
        if (!rule.values.includes(String(v))) errorsFor(rule.message);
        break;
      }
      case 'mongoId': {
        const v = typeof value === 'string' ? value.trim() : value;
        if (v !== undefined && v !== '' && !MONGO_ID_RE.test(String(v))) errorsFor(rule.message);
        break;
      }
      case 'custom':
        if (!rule.test(body)) errorsFor(rule.message);
        break;
    }
  }

  return errors;
};

export const assertValid = (body: unknown, rules: Rule[]): void => {
  const errors = validate(body, rules);
  if (errors.length > 0) throw new ValidationError(errors);
};

export { getPath };
