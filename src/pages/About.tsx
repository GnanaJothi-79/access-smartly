import { Mail, Github, Linkedin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const teamMembers = [
    {
      name: "Project Lead",
      role: "System Architecture & Backend",
      email: "lead@university.edu",
    },
    {
      name: "Frontend Developer",
      role: "UI/UX & React Development",
      email: "frontend@university.edu",
    },
    {
      name: "Hardware Integration",
      role: "ID Card Scanner & IoT",
      email: "hardware@university.edu",
    },
    {
      name: "Database Admin",
      role: "Data Management & Analytics",
      email: "database@university.edu",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-5xl">
          {/* Project Description */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-6">About SLAMS</h1>
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
              <p className="text-muted-foreground mb-4">
                The Smart Lab Access & Monitoring System (SLAMS) is an innovative solution designed to streamline
                computer lab management in educational institutions. Our system eliminates manual attendance tracking
                and provides real-time monitoring of lab resources.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Key Objectives</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Automated student authentication using ID cards</li>
                <li>Real-time system availability tracking</li>
                <li>Session management with automatic time limits</li>
                <li>Administrative dashboard for monitoring and analytics</li>
                <li>Enhanced security and resource optimization</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS", "Recharts", "Local Storage API", "ID Card Scanning"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Our Team</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground mb-4">{member.role}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${member.email}`} className="text-primary hover:underline">
                      {member.email}
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Interested in implementing SLAMS at your institution? We'd love to hear from you!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:slams@university.edu" className="text-primary hover:underline">
                    slams@university.edu
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">GitHub</p>
                  <a href="#" className="text-primary hover:underline">
                    github.com/slams-project
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <a href="#" className="text-primary hover:underline">
                    linkedin.com/company/slams
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
