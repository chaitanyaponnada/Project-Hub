import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Code, Feather, Zap } from "lucide-react";
import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/placeholder-data";

export default function Home() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 text-center bg-gradient-to-b from-background to-background/80">
          <div
            className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03]"
            style={{ backgroundSize: "2rem 2rem" }}
          ></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in-down">
                Accelerate Your B.Tech Journey
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                Discover high-quality, ready-to-use projects to excel in your studies and build an impressive portfolio.
              </p>
              <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/projects">Explore Projects <ArrowRight className="ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Why Choose BTech Central?</h2>
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
        
        {/* Featured Projects Section */}
        <section id="projects" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Featured Projects</h2>
              <p className="text-lg text-muted-foreground mt-2">A glimpse of what we offer.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, i) => (
                <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.2 + 0.2}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link href="/projects">
                  View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}