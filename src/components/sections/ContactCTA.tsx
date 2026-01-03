'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod validation schema
const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^[\d\s\-+()]{10,}$/,
      'Please enter a valid phone number (minimum 10 digits)'
    ),
  message: z
    .string()
    .min(1, 'Project details are required')
    .min(10, 'Please provide project details (10-1000 characters)')
    .max(1000, 'Please provide project details (10-1000 characters)'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meeogaqn';

export function ContactCTA() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  });

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => {
        setSubmitError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  // Focus first error field on validation fail
  useEffect(() => {
    const errorFields = Object.keys(errors) as (keyof ContactFormData)[];
    if (errorFields.length > 0) {
      setFocus(errorFields[0]);
    }
  }, [errors, setFocus]);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Formspree error:', errorData);
        throw new Error('Form submission failed');
      }

      // Success
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  // Helper function to get input classes with error state
  const getInputClasses = (fieldName: keyof ContactFormData) => {
    const baseClasses =
      'w-full bg-transparent border-0 border-b py-3 font-body text-2xl md:text-3xl text-foreground placeholder:text-muted/40 outline-none transition-colors';
    const errorClasses = errors[fieldName]
      ? 'border-red-500 focus:border-red-500'
      : 'border-muted/50 focus:border-foreground';
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <section className="bg-background py-20 md:py-32 lg:py-40">
      <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-start">
            <span className="font-body text-sm uppercase tracking-widest text-muted mb-6">
              Get in touch
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-8">
              Speak to me.
            </h2>
            <p className="font-body text-lg md:text-xl text-muted max-w-md">
              If you want to start a project, share an idea or simply say hi, we
              want to hear from you.
            </p>
          </div>

          {/* Right Column - Form */}
          <div>
            {/* Success Message */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3"
                  role="alert"
                  aria-live="polite"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="font-body text-green-600 dark:text-green-400">
                    Thank you! Your message has been sent successfully.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form-level Error Message */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="font-body text-red-600 dark:text-red-400">
                    {submitError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block font-body text-sm text-muted"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Emma"
                    aria-required="true"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    className={getInputClasses('firstName')}
                    {...register('firstName')}
                  />
                  <AnimatePresence>
                    {errors.firstName && (
                      <motion.p
                        id="firstName-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500 font-body mt-1"
                        role="alert"
                      >
                        {errors.firstName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block font-body text-sm text-muted"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Eghwa"
                    aria-required="true"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                    className={getInputClasses('lastName')}
                    {...register('lastName')}
                  />
                  <AnimatePresence>
                    {errors.lastName && (
                      <motion.p
                        id="lastName-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500 font-body mt-1"
                        role="alert"
                      >
                        {errors.lastName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block font-body text-sm text-muted"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="emma@email.com"
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={getInputClasses('email')}
                    {...register('email')}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        id="email-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500 font-body mt-1"
                        role="alert"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block font-body text-sm text-muted"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+254"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={getInputClasses('phone')}
                    {...register('phone')}
                  />
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        id="phone-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-500 font-body mt-1"
                        role="alert"
                      >
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Row 3: Project Details */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block font-body text-sm text-muted"
                >
                  Project details
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us about your project..."
                  rows={4}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`${getInputClasses('message')} resize-none`}
                  {...register('message')}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      id="message-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-500 font-body mt-1"
                      role="alert"
                    >
                      {errors.message.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-body text-sm uppercase tracking-widest rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={isSubmitting ? {} : { scale: 1.02 }}
                whileTap={isSubmitting ? {} : { scale: 0.98 }}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <ArrowUpRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
