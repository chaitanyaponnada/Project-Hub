
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Code, Feather, Zap, Users, Target, Search } from "lucide-react";
import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { projects, categories } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, loading } = useAuth();
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative py-24 md:py-32 text-center bg-gradient-to-b from-background to-background/80">
          <div
            className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03]"
            style={{ backgroundSize: "2rem 2rem" }}
          ></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in-down">
                Project Hub
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                complete your final year project now
              </p>
              <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="#projects">Explore Projects <ArrowRight className="ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Why Choose Project Hub?</h2>
              <p className="text-lg text-muted-foreground mt-2">Everything you need in one place.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Card className="p-8 h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="inline-block p-4 bg-primary text-primary-foreground rounded-full mb-4">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2">Ready to Deploy</h3>
                  <p className="text-muted-foreground">Save time with complete, well-documented projects that you can use instantly.</p>
                </Card>
              </div>
              <div className="p-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Card className="p-8 h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="inline-block p-4 bg-primary text-primary-foreground rounded-full mb-4">
                    <Code className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2">Quality Code</h3>
                  <p className="text-muted-foreground">Learn from best practices with clean, efficient, and professionally written code.</p>
                </Card>
              </div>
              <div className="p-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <Card className="p-8 h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="inline-block p-4 bg-primary text-primary-foreground rounded-full mb-4">
                    <Feather className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2">Showcase Your Skills</h3>
                  <p className="text-muted-foreground">Build a standout portfolio that impresses recruiters and showcases your talent.</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20">
            <div className="container mx-auto px-4">
              <header className="mb-12 text-center">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Project Marketplace</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover and acquire high-quality, ready-to-use projects for your academic and professional needs.
                </p>
              </header>
              
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search for projects..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, i) => (
                  <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <ProjectCard project={project} isBlurred={!user && !loading} />
                  </div>
                ))}
              </div>
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">About Project Hub</h2>
                <p className="text-lg text-muted-foreground mt-2">The principles that guide us.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
                <div className="animate-fade-in-right">
                  <h3 className="font-headline text-3xl font-bold text-primary mb-4">Our Mission</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    Our mission is to bridge the gap between academic learning and practical application. We believe that hands-on experience is crucial for success in the tech industry. Project Hub provides a curated marketplace of projects to help students learn, grow, and build a portfolio that stands out.
                  </p>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent text-accent-foreground rounded-full mt-1">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Accelerate Learning</h4>
                      <p className="text-muted-foreground">Jumpstart your understanding of complex technologies.</p>
                    </div>
                  </div>
                </div>
                <div className="animate-fade-in-left">
                  <Card className="overflow-hidden shadow-lg">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src="https://picsum.photos/seed/about1/800/600"
                        alt="Team working on a project"
                        fill
                        className="object-cover"
                        data-ai-hint="team collaboration"
                      />
                    </div>
                  </Card>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <Card className="p-8 h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                      <div className="inline-block p-4 bg-primary text-primary-foreground rounded-full mb-4">
                          <Code className="h-8 w-8" />
                      </div>
                      <h3 className="font-headline text-xl font-bold mb-2">Quality & Excellence</h3>
                      <p className="text-muted-foreground">We maintain high standards for all our projects, ensuring they are well-structured, documented, and use modern technologies.</p>
                    </Card>
                </div>
                <div className="p-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <Card className="p-8 h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                      <div className="inline-block p-4 bg-primary text-primary-foreground rounded-full mb-4">
                          <Users className="h-8 w-8" />
                      </div>
                      <h3 className="font-headline text-xl font-bold mb-2">Student-Centric</h3>
                      <p className="text-muted-foreground">Our platform is built around the needs of students, providing resources that are both educational and practical.</p>
                  </Card>
                </div>
                 <div className="p-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <Card className="p-8 h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                      <div className="inline-block p-4 bg-primary text-primary-foreground rounded-full mb-4">
                          <Target className="h-8 w-8" />
                      </div>
                      <h3 className="font-headline text-xl font-bold mb-2">Bridging Theory & Practice</h3>
                      <p className="text-muted-foreground">We provide tangible examples that connect theoretical knowledge with real-world application.</p>
                  </Card>
                </div>
              </div>
            </div>
        </section>

      </main>
    </div>
  );
}
