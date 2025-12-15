'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectDetails: string;
}

export function ContactCTA() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectDetails: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented later
    console.log('Form submitted:', formData);
  };

  return (
    <section className="bg-background py-20 md:py-32 lg:py-40">
      <div className="w-full px-8 md:px-12 lg:px-16">
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
            <form onSubmit={handleSubmit} className="space-y-10">
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
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Emma"
                    required
                    className="w-full bg-transparent border-0 border-b border-muted/50 focus:border-foreground py-3 font-body text-2xl md:text-3xl text-foreground placeholder:text-muted/40 outline-none transition-colors"
                  />
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
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Eghwa"
                    required
                    className="w-full bg-transparent border-0 border-b border-muted/50 focus:border-foreground py-3 font-body text-2xl md:text-3xl text-foreground placeholder:text-muted/40 outline-none transition-colors"
                  />
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="emma@email.com"
                    required
                    className="w-full bg-transparent border-0 border-b border-muted/50 focus:border-foreground py-3 font-body text-2xl md:text-3xl text-foreground placeholder:text-muted/40 outline-none transition-colors"
                  />
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254"
                    className="w-full bg-transparent border-0 border-b border-muted/50 focus:border-foreground py-3 font-body text-2xl md:text-3xl text-foreground placeholder:text-muted/40 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Project Details */}
              <div className="space-y-2">
                <label
                  htmlFor="projectDetails"
                  className="block font-body text-sm text-muted"
                >
                  Project details
                </label>
                <textarea
                  id="projectDetails"
                  name="projectDetails"
                  value={formData.projectDetails}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows={4}
                  required
                  className="w-full bg-transparent border-0 border-b border-muted/50 focus:border-foreground py-3 font-body text-2xl md:text-3xl text-foreground placeholder:text-muted/40 outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-body text-sm uppercase tracking-widest rounded-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Enquiry
                <ArrowUpRight className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
