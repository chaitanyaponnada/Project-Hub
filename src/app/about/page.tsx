import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background animate-fade-in">
      {/* Hero Section */}
      <section className="py-24 md:py-32 text-center bg-muted/30">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">About Project Hub</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We are dedicated to empowering the next generation of engineers and developers by providing high-quality, real-world project examples.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-right">
              <h2 className="font-headline text-3xl font-bold text-primary mb-4">Our Mission</h2>
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
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Our Values</h2>
            <p className="text-lg text-muted-foreground mt-2">The principles that guide us.</p>
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
    </div>
  );
}
