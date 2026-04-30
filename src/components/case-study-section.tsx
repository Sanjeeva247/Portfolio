"use client";

import { motion } from "motion/react";
import { AlertCircle, Lightbulb, TrendingUp, Zap } from "lucide-react";

export function CaseStudySection() {
  const caseStudies = [
    {
      title: "API Performance Optimization",
      problem: "The LMS system was experiencing slow response times with API calls taking 3-5 seconds, affecting 10,000+ daily users and causing session timeouts.",
      solution: "Implemented database indexing, query optimization with aggregation pipelines, Redis caching for frequently accessed data, and pagination for large datasets.",
      impact: [
        "Reduced API response time from 3-5s to 200-300ms (94% improvement)",
        "Decreased database load by 60% through caching",
        "Improved user satisfaction scores from 3.2 to 4.7/5",
        "Handled 3x more concurrent users without infrastructure changes",
      ],
      color: "from-purple-500 to-blue-500",
    },
    {
      title: "Authentication System Overhaul",
      problem: "Legacy session-based authentication was causing scalability issues, memory leaks, and security vulnerabilities in the travel booking platform.",
      solution: "Migrated to JWT-based authentication with refresh tokens, implemented role-based access control (RBAC), added rate limiting, and integrated OAuth2 for social logins.",
      impact: [
        "Eliminated session-related memory leaks completely",
        "Reduced authentication overhead by 70%",
        "Enabled horizontal scaling across multiple servers",
        "Enhanced security with token expiration and refresh mechanism",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Database Schema Redesign",
      problem: "Complex joins and N+1 query problems in the task management system were causing page load times of 8-12 seconds for dashboard views.",
      solution: "Redesigned MongoDB schema with embedded documents for frequently accessed data, implemented aggregation pipelines, added compound indexes, and used projection to limit returned fields.",
      impact: [
        "Reduced dashboard load time from 8-12s to under 1s (92% faster)",
        "Decreased database queries from 150+ to 5 per page load",
        "Improved scalability to handle 50K+ tasks per user",
        "Reduced server costs by 40% through efficiency gains",
      ],
      color: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <section id="case-studies" className="py-20 px-4 sm:px-6 lg:px-8 relative">
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
              Case Studies
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Real-world problems solved with measurable impact
          </p>
        </motion.div>

        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
                <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${study.color} bg-opacity-20 border border-purple-500/30 mb-6`}>
                  <h3 className="text-xl text-white">{study.title}</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <h4 className="text-lg text-red-300">Problem</h4>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{study.problem}</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-blue-400" />
                      </div>
                      <h4 className="text-lg text-blue-300">Solution</h4>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{study.solution}</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </div>
                      <h4 className="text-lg text-green-300">Impact</h4>
                    </div>
                    <ul className="space-y-2">
                      {study.impact.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-gray-400">
                          <Zap className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
