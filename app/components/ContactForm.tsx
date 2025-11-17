"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Building, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Integrate with your email service or API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-6xl md:text-7xl font-black mb-4 text-white tracking-tight">
              Get in Touch
            </h2>
            <p className="text-xl font-bold text-white/70">
              Let's build something amazing together
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border border-white/10 bg-black/40 backdrop-blur-sm p-8 rounded-lg"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Name *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    size={18}
                  />
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/20 rounded-lg text-white focus:border-[#d8ff00] focus:ring-2 focus:ring-[#d8ff00]/20 outline-none transition-all font-normal placeholder:text-white/30"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-[#d8ff00] text-sm mt-1.5 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    size={18}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/20 rounded-lg text-white focus:border-[#d8ff00] focus:ring-2 focus:ring-[#d8ff00]/20 outline-none transition-all font-normal placeholder:text-white/30"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-[#d8ff00] text-sm mt-1.5 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    size={18}
                  />
                  <input
                    {...register("company")}
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/20 rounded-lg text-white focus:border-[#d8ff00] focus:ring-2 focus:ring-[#d8ff00]/20 outline-none transition-all font-normal placeholder:text-white/30"
                    placeholder="Your Company (Optional)"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare
                    className="absolute left-4 top-4 text-white/30"
                    size={18}
                  />
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/20 rounded-lg text-white focus:border-[#d8ff00] focus:ring-2 focus:ring-[#d8ff00]/20 outline-none transition-all resize-none font-normal placeholder:text-white/30"
                    placeholder="Tell me about your project..."
                  />
                </div>
                {errors.message && (
                  <p className="text-[#d8ff00] text-sm mt-1.5 font-medium">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d8ff00] text-black py-4 font-semibold text-base hover:bg-[#d8ff00]/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#d8ff00]/20 rounded-[5px]"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>

              {/* Success Message */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-[#d8ff00] bg-[#d8ff00]/10 text-[#d8ff00] p-4 text-center text-sm font-medium rounded-lg"
                >
                  ✓ Message sent successfully!
                </motion.div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
