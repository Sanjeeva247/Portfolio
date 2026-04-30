"use client";
import { motion } from "motion/react";
import { Code2, Database, Zap, Award } from "lucide-react";

export function AboutSection() {
  const stats = [
    { icon: Code2, label: "Projects Completed", value: "10+" },
    { icon: Database, label: "APIs Built", value: "50+" },
    { icon: Zap, label: "Performance Boost", value: "40%" },
    { icon: Award, label: "Months Experience", value: "5+" },
  ];

  const timeline = [
    {
      year: "Nov 2025 - Apr 2026",
      title: "Full Stack Developer",
      company: "I2global.",
      description: "Leading development of scalable microservices architecture",
    },
    {
      year: "July 2025 - Nov 2025",
      title: "PHP Developer Intern",
      company: "Digital Solutions Corp.",
      description: "Built enterprise-level applications with React and FastAPI",
    },
    {
      year: "Feb 2025 - May 2025",
      title: "Trainee",
      company: "DR. Reddy's Foundation",
      description: "Developed RESTful APIs and database optimization",
    },
    {
      year: "July 2024 - Jan 2025",
      title: "Trainee",
      company: "Thopstech Career Solutions",
      description: "Developed RESTful APIs and database optimization",
    },
    
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative">
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
              About Me
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Passionate about crafting elegant solutions to complex problems
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-2xl mb-4 text-white">Professional Summary</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Full Stack Developer with 5+ Months of experience building scalable web applications.
                Specialized in creating high-performance REST APIs using FastAPI and modern frontend
                frameworks like React and Next.js.
              </p>
              <p className="text-gray-300 leading-relaxed">
                My expertise lies in architecting robust backend systems, implementing role-based
                access control, and optimizing database queries for maximum performance. I'm passionate
                about clean code, system design, and delivering exceptional user experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-cyan-500/20 backdrop-blur-sm"
                >
                  <stat.icon className="w-8 h-8 text-cyan-400 mb-3" />
                  <div className="text-3xl mb-1 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl text-white mb-6">Experience Timeline</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500" />

              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="pl-8 relative group"
                >
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20 group-hover:ring-8 transition-all" />
                  <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
                    <div className="text-sm text-cyan-400 mb-2">{item.year}</div>
                    <h4 className="text-xl text-white mb-1">{item.title}</h4>
                    <div className="text-purple-300 mb-3">{item.company}</div>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
