"use client";

import { motion } from "motion/react";
import { ExternalLink, Github, BookOpen, Plane, CheckSquare, Video } from "lucide-react";
import { Button } from "./ui/button";

export function ProjectsSection() {
  const projects = [
    {
      icon: BookOpen,
      title: "Proedge Learning Management System",
      description:
        "Enterprise LMS with role-based access control, course management, student dashboards, and comprehensive analytics. Features JWT authentication, real-time progress tracking, and automated grading system.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop",
      tags: ["React", "FastAPI", "MongoDB", "RBAC", "JWT", "WebSocket"],
      github: "https://github.com/i2global-IT/proedgeNew",
      live: "https://proedgenew.i2global.in/",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Plane,
      title: "Cmytrip Travel Booking System",
      description:
        "Full-featured travel booking platform with advanced search filters, real-time availability, secure payment integration, booking management, and itinerary generation. Supports multi-city trips and hotel reservations.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop",
      tags: ["Next.js", "Node.js", "MySQL", "Stripe", "Redis", "REST API"],
      // github: "https://github.com",
      live: "https://cmytrip.com/",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckSquare,
      title: "Task Manager Pro",
      description:
        "Professional task management application with CRUD operations, JWT authentication, team collaboration features, deadline tracking, priority management, and activity logs. Includes Kanban board and calendar views.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop",
      tags: ["React", "FastAPI", "PostgreSQL", "JWT", "WebSocket", "Redux"],
      github: "https://github.com/sanjeeva-code/Creativehub",
      live: "https://taskmanager.d38kef8n2m7lua.amplifyapp.com/",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Video,
      title: "MeetFlow - Video Conferencing",
      description:
        "Real-time video conferencing platform with screen sharing, chat, recording capabilities, virtual backgrounds, breakout rooms, and participant management. Built with WebRTC for peer-to-peer connections.",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop",
      tags: ["React", "WebRTC", "Socket.io", "Node.js", "MongoDB", "AWS"],
      github: "https://github.com/sanjeeva-code/video-meet",
      live: "https://agorademo.dzhtzg7fehzn.amplifyapp.com/",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative">
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
              Featured Projects
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Showcasing real-world applications built with modern technologies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="h-full rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm overflow-hidden hover:border-purple-500/40 transition-all">
                <div className="relative overflow-hidden h-48 bg-gray-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  <div className={`absolute top-4 left-4 w-12 h-12 rounded-lg bg-gradient-to-br ${project.color} p-2.5`}>
                    <project.icon className="w-full h-full text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-purple-500/50 hover:border-purple-400 text-purple-300 hover:bg-purple-500/10"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0"
                      onClick={() => window.open(project.live, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
