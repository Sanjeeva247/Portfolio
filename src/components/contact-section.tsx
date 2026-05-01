"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Github, Linkedin, Send, CheckCircle, MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_CONTACT_FORM_SCRIPT_URL;
      if (!scriptUrl) {
        setError("Contact form is not configured. Please reach out via email.");
        return;
      }

      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      const res = await fetch(`${scriptUrl}?${params.toString()}`, {
        method: "GET",
      });

      const data = await res.json();

      if (data.result !== "success") {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "sanjeevakumarm945@gmail.com", href: "mailto:sanjeeva@example.com" },
    { icon: Phone, label: "Phone", value: "+91 9515385297", href: "tel:+919876543210" },
    { icon: MapPin, label: "Location", value: "Bangalore, India", href: null },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com/Sanjeeva247", color: "hover:text-purple-400" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/sanjeevakumarm", color: "hover:text-blue-400" },
    { icon: Mail, label: "Email", href: "mailto:sanjeevakumarm945@gmail.com", color: "hover:text-cyan-400" },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Let's collaborate on your next project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-2xl text-white mb-6">Contact Information</h3>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 p-2.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <info.icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{info.label}</div>
                      {info.href ? (
                        <a href={info.href} className="text-white hover:text-cyan-400 transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-white">{info.value}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <h4 className="text-lg text-white mb-4">Connect with me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-lg bg-gray-900/50 border border-cyan-500/20 hover:border-cyan-400 flex items-center justify-center text-gray-400 ${social.color} transition-all`}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm"
            >
              <h4 className="text-xl text-white mb-4">Available for</h4>
              <div className="space-y-2">
                {["Full-time opportunities", "Freelance projects", "Technical consulting", "Open source collaboration"].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-900/50 border-cyan-500/30 focus:border-cyan-400 text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-900/50 border-cyan-500/30 focus:border-cyan-400 text-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="bg-gray-900/50 border-cyan-500/30 focus:border-cyan-400 text-white resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isSuccess}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message
                  </span>
                )}
              </Button>

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-center"
                >
                  Thank you! I'll get back to you soon.
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center"
                >
                  {error}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
