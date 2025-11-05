"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    title: "AI-Powered Analytics Dashboard",
    description:
      "Real-time data visualization and predictive analytics platform using machine learning models.",
    image: "/placeholder-project1.jpg",
    tags: ["Python", "TensorFlow", "React", "Next.js"],
    link: "#",
    github: "#",
  },
  {
    title: "Smart Customer Support Bot",
    description:
      "Natural language processing chatbot that reduced customer support tickets by 60%.",
    image: "/placeholder-project2.jpg",
    tags: ["NLP", "OpenAI", "Node.js", "TypeScript"],
    link: "#",
    github: "#",
  },
  {
    title: "Automated Content Generation",
    description:
      "AI-driven content creation system for marketing teams, generating SEO-optimized content.",
    image: "/placeholder-project3.jpg",
    tags: ["GPT-4", "Python", "FastAPI", "React"],
    link: "#",
    github: "#",
  },
  {
    title: "Predictive Maintenance System",
    description:
      "IoT-integrated ML system for predicting equipment failures before they occur.",
    image: "/placeholder-project4.jpg",
    tags: ["PyTorch", "IoT", "Azure", "Time Series"],
    link: "#",
    github: "#",
  },
  {
    title: "Computer Vision Quality Control",
    description:
      "Automated visual inspection system for manufacturing defect detection.",
    image: "/placeholder-project5.jpg",
    tags: ["Computer Vision", "OpenCV", "YOLO", "Python"],
    link: "#",
    github: "#",
  },
  {
    title: "Recommendation Engine",
    description:
      "Personalized product recommendation system increasing conversion rates by 45%.",
    image: "/placeholder-project6.jpg",
    tags: ["Collaborative Filtering", "Spark", "Scala", "AWS"],
    link: "#",
    github: "#",
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Showcasing innovative AI solutions that have transformed businesses
            and solved complex challenges
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              {/* Project Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-20">
                  AI
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <a
                    href={project.link}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>View Project</span>
                  </a>
                  <a
                    href={project.github}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center bg-white rounded-2xl shadow-xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how we can bring your vision to life with AI
          </p>
          <a
            href="/#contact"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
          >
            Schedule a Consultation
          </a>
        </motion.div>
      </div>
    </div>
  );
}
