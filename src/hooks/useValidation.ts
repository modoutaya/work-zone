import { useState, useCallback } from 'react';
import { z, ZodError } from 'zod';

interface ValidationResult<T> {
  isValid: boolean;
  errors: Record<string, string>;
  data: T | null;
}

interface UseValidationOptions {
  onSuccess?: (data: any) => void;
  onError?: (errors: Record<string, string>) => void;
}

export const useValidation = <T>(schema: z.ZodSchema<T>, options: UseValidationOptions = {}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback((data: unknown): ValidationResult<T> => {
    setIsValidating(true);
    
    try {
      const validatedData = schema.parse(data);
      setErrors({});
      options.onSuccess?.(validatedData);
      
      return {
        isValid: true,
        errors: {},
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap: Record<string, string> = {};
        
        error.issues.forEach((err: any) => {
          const field = err.path.join('.');
          errorMap[field] = err.message;
        });
        
        setErrors(errorMap);
        options.onError?.(errorMap);
        
        return {
          isValid: false,
          errors: errorMap,
          data: null,
        };
      }
      
      // Erreur inattendue
      const unexpectedError = { general: 'Erreur de validation inattendue' };
      setErrors(unexpectedError);
      options.onError?.(unexpectedError);
      
      return {
        isValid: false,
        errors: unexpectedError,
        data: null,
      };
    } finally {
      setIsValidating(false);
    }
  }, [schema, options]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  return {
    validate,
    clearErrors,
    setFieldError,
    errors,
    isValidating,
  };
};

// Hook spécialisé pour la validation de formulaires
export const useFormValidation = <T>(schema: z.ZodSchema<T>) => {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const validateField = useCallback((field: keyof T) => {
    // Validation simplifiée - on valide tout le formulaire
    setIsValidating(true);
    
    try {
      const validatedData = schema.parse(formData);
      setErrors({});
      setIsValidating(false);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          const field = err.path.join('.');
          errorMap[field] = err.message;
        });
        setErrors(errorMap);
        setIsValidating(false);
      }
      return false;
    }
  }, [schema, formData]);

  const validateForm = useCallback(() => {
    setIsValidating(true);
    
    try {
      const validatedData = schema.parse(formData);
      setErrors({});
      setIsValidating(false);
      
      return {
        isValid: true,
        data: validatedData,
        errors: {},
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap: Record<string, string> = {};
        
        error.issues.forEach((err: any) => {
          const field = err.path.join('.');
          errorMap[field] = err.message;
        });
        
        setErrors(errorMap);
        setIsValidating(false);
        
        return {
          isValid: false,
          data: null,
          errors: errorMap,
        };
      }
      
      setIsValidating(false);
      return {
        isValid: false,
        data: null,
        errors: { general: 'Erreur de validation inattendue' },
      };
    }
  }, [schema, formData]);

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isValidating,
    updateField,
    validateField,
    validateForm,
    resetForm,
  };
}; 