"use client";

import { motion } from "motion/react";
import { Code, Server, Database, Wrench } from "lucide-react";

export function SkillsSection() {
  const skillCategories = [
    {
      icon: Code,
      title: "Frontend",
      color: "from-purple-500 to-pink-500",
      skills: ["React", "Next.js", "Angular", "TypeScript", "Tailwind CSS", "Redux"],
    },
    {
      icon: Server,
      title: "Backend",
      color: "from-blue-500 to-cyan-500",
      skills: ["FastAPI", "Node.js", "Express", "Python", "REST APIs", "GraphQL"],
    },
    {
      icon: Database,
      title: "Database",
      color: "from-cyan-500 to-teal-500",
      skills: ["MongoDB", "MySQL", "PostgreSQL", "Redis", "Prisma", "SQLAlchemy"],
    },
    {
      icon: Wrench,
      title: "Tools & DevOps",
      color: "from-orange-500 to-red-500",
      skills: ["Git", "Docker", "Postman", "VS Code", "Linux", "CI/CD"],
    },
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 relative">
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
              Technical Skills
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Mastering the modern tech stack
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-full h-full text-white" />
                </div>

                <h3 className="text-xl text-white mb-4">{category.title}</h3>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-sm text-gray-300 hover:text-white hover:border-cyan-400/50 transition-all cursor-default"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-purple-500/20 backdrop-blur-sm"
        >
          <div className="text-center">
            <h3 className="text-2xl text-white mb-4">Core Expertise</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {[
                "REST API Design",
                "Microservices",
                "Authentication & Authorization",
                "Database Optimization",
                "System Architecture",
                "Performance Tuning",
                "Responsive Design",
                "State Management",
                "Agile Development",
                "Code Review",
              ].map((expertise, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-gray-300 hover:text-white hover:border-cyan-400 transition-all cursor-default"
                >
                  {expertise}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
