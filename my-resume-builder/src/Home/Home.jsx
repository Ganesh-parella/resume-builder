import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Sparkles,
  FileText,
  Bot,
  Download,
  CheckCircle,
  Star,
  Users,
  Zap,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-20 md:py-28 text-center">
        <div className="max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 50,000+ job seekers
          </Badge>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
            Build Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Perfect Resume
            </span>
            <br className="hidden sm:block" /> in Minutes
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Create stunning, ATS-optimized resumes with our AI-powered builder.
            Choose from professional templates, customize with ease, and land
            your dream job faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-4 h-14 group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="ml-2">4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>50,000+ users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Everything you need to succeed
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Our comprehensive suite of tools helps you create, customize, and
            optimize your resume for maximum impact.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "AI-Powered Writing",
                desc: "Get intelligent suggestions and content optimization powered by advanced AI.",
                icon: Bot,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Professional Templates",
                desc: "Choose from 50+ modern, recruiter-approved templates designed for success.",
                icon: FileText,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "ATS Optimization",
                desc: "Ensure your resume passes through applicant tracking systems seamlessly.",
                icon: CheckCircle,
                color: "from-emerald-500 to-teal-500",
              },
              {
                title: "Instant Export",
                desc: "Download high-quality PDFs, Word docs, or share with a custom link.",
                icon: Download,
                color: "from-orange-500 to-red-500",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-lg sm:text-xl opacity-90 mb-10 leading-relaxed">
            Join thousands of successful job seekers who've transformed their
            careers with ResuCraft.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-4 h-14 group bg-white text-gray-900 hover:bg-gray-100"
              >
                <Zap className="mr-2 h-5 w-5" />
                Build My Resume
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} ResuCraft. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white">
              Privacy
            </Link>
            <Link to="#" className="hover:text-white">
              Terms
            </Link>
            <Link to="#" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
