"use client";
import { motion } from "motion/react";
import { Monitor, Server, Database, Lock, Zap, ArrowRight } from "lucide-react";

export function ArchitectureSection() {
  const architectures = [
    {
      title: "Full Stack Architecture",
      nodes: [
        { icon: Monitor, label: "Frontend", color: "from-purple-500 to-pink-500", desc: "React / Next.js" },
        { icon: Server, label: "Backend", color: "from-blue-500 to-cyan-500", desc: "FastAPI / Node.js" },
        { icon: Database, label: "Database", color: "from-cyan-500 to-teal-500", desc: "MongoDB / MySQL" },
      ],
    },
    {
      title: "REST API Flow",
      nodes: [
        { icon: Monitor, label: "Client Request", color: "from-purple-500 to-pink-500", desc: "HTTP/HTTPS" },
        { icon: Zap, label: "API Gateway", color: "from-orange-500 to-red-500", desc: "Rate Limiting" },
        { icon: Server, label: "Controller", color: "from-blue-500 to-cyan-500", desc: "Business Logic" },
        { icon: Database, label: "Data Layer", color: "from-cyan-500 to-teal-500", desc: "CRUD Operations" },
      ],
    },
    {
      title: "JWT Authentication",
      nodes: [
        { icon: Monitor, label: "Login", color: "from-purple-500 to-pink-500", desc: "Credentials" },
        { icon: Lock, label: "Verify", color: "from-orange-500 to-red-500", desc: "Validation" },
        { icon: Zap, label: "Token", color: "from-blue-500 to-cyan-500", desc: "Generate JWT" },
        { icon: Server, label: "Protected", color: "from-cyan-500 to-teal-500", desc: "Authorized Access" },
      ],
    },
  ];

  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 relative">
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
              System Architecture
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Clean, scalable, and production-ready system design
          </p>
        </motion.div>

        <div className="space-y-12">
          {architectures.map((arch, archIndex) => (
            <motion.div
              key={archIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: archIndex * 0.2, duration: 0.6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm"
            >
              <h3 className="text-2xl text-white mb-8 text-center">{arch.title}</h3>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {arch.nodes.map((node, nodeIndex) => (
                  <div key={nodeIndex} className="flex items-center gap-4 md:gap-8">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: archIndex * 0.2 + nodeIndex * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${node.color} p-4 mb-3 shadow-lg shadow-purple-500/20`}>
                        <node.icon className="w-full h-full text-white" />
                      </div>
                      <div className="text-white mb-1">{node.label}</div>
                      <div className="text-sm text-gray-400">{node.desc}</div>
                    </motion.div>

                    {nodeIndex < arch.nodes.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: archIndex * 0.2 + nodeIndex * 0.1 + 0.2, duration: 0.4 }}
                        className="hidden md:block"
                      >
                        <ArrowRight className="w-8 h-8 text-cyan-400" />
                      </motion.div>
                    )}

                    {nodeIndex < arch.nodes.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: archIndex * 0.2 + nodeIndex * 0.1 + 0.2, duration: 0.4 }}
                        className="md:hidden"
                      >
                        <div className="rotate-90">
                          <ArrowRight className="w-6 h-6 text-cyan-400" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Microservices",
              description: "Scalable, independent services communicating via REST APIs",
              color: "from-purple-500/20 to-pink-500/20",
            },
            {
              title: "Database Design",
              description: "Optimized schemas, indexing, and query performance",
              color: "from-blue-500/20 to-cyan-500/20",
            },
            {
              title: "Security First",
              description: "JWT authentication, RBAC, input validation, and encryption",
              color: "from-cyan-500/20 to-teal-500/20",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl bg-gradient-to-br ${item.color} border border-purple-500/20 backdrop-blur-sm`}
            >
              <h4 className="text-xl text-white mb-3">{item.title}</h4>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
