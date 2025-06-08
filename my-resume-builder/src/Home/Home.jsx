import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center px-6 py-20 text-center relative">
        <div className="max-w-4xl z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            Build Your <span className="text-primary">Perfect Resume</span> in Minutes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            ResuCraft helps you craft beautiful, ATS-friendly resumes effortlessly.
            Choose a template, customize it, and land your dream job.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3 group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">Why Choose ResuCraft?</h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Easy to Use",
                desc: "No design skills required. Our builder guides you step-by-step.",
                icon: "🧠",
              },
              {
                title: "Professional Templates",
                desc: "Choose from a range of sleek, modern templates.",
                icon: "📄",
              },
              {
                title: "ATS-Optimized",
                desc: "Get past resume screeners with our optimized layouts.",
                icon: "🤖",
              },
              {
                title: "Export Instantly",
                desc: "Download high-quality PDFs with one click.",
                icon: "📥",
              },
            ].map((item, i) => (
              <div key={i} className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition duration-300 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Start Crafting Your Resume Now</h2>
          <p className="text-lg opacity-90 mb-8">
            Trusted by job seekers across industries. Simple. Effective. Fast.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-4 group">
              Build My Resume
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ResuCraft. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white">Privacy</Link>
            <Link to="#" className="hover:text-white">Terms</Link>
            <Link to="#" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
