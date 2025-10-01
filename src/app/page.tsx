

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Feather, Zap, Users, Target, Search, Loader2, Send } from "lucide-react";
import Image from "next/image";
import { projects, categories, faqs } from "@/lib/placeholder-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useInquiry } from "@/hooks/use-inquiry";
import { useState, useEffect, useRef } from "react";
import { Footer } from "@/components/layout/footer";
import { ProjectCard } from "@/components/project-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message must not exceed 1000 characters."),
});

const useTypewriter = (text: string, speed = 50) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
  
    useEffect(() => {
      setIsTyping(true);
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, speed);
  
      return () => {
        clearInterval(typingInterval);
      };
    }, [text, speed]);
  
    return {displayText, isTyping};
};

const NodeGarden = () => {
    return (
        <div className="relative h-full w-full flex items-center justify-center bg-transparent overflow-hidden">
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="node"
                        style={{
                            '--size': `${Math.random() * 5 + 2}px`,
                            '--x': `${Math.random() * 100}%`,
                            '--y': `${Math.random() * 100}%`,
                            '--duration': `${Math.random() * 10 + 10}s`,
                            '--delay': `${Math.random() * -10}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>
            <svg className="absolute inset-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}>
                <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0 }} />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#glow)" />
            </svg>
        </div>
    );
};

const HeroBackground = () => {
  const { theme } = useTheme();
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    // Set video source based on theme, but only on the client
    setVideoSrc(
      theme === 'dark'
        ? 'https://res.cloudinary.com/dagqmrniu/video/upload/v1759294420/12_lhizfb.mp4'
        : 'https://res.cloudinary.com/dagqmrniu/video/upload/v1759294376/2_lksdur.mp4'
    );
  }, [theme]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {videoSrc && (
          <video
          key={videoSrc}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { addInquiry } = useInquiry();
  const [isLoading, setIsLoading] = useState(false);
  const {displayText: typedTitle, isTyping} = useTypewriter("Project Hub", 100);

  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
        message: form.getValues("message") || "",
      });
    }
  }, [user, form]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search');
    router.push(`/projects?q=${query}`);
  };

  async function onContactSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    addInquiry({
      ...values,
      date: new Date().toISOString(),
      id: Math.random().toString(36).substring(7)
    });
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
    });
    form.reset({
        ...form.getValues(),
        message: ''
    });
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative py-24 md:py-32 text-center overflow-hidden">
          <HeroBackground />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-headline text-6xl md:text-8xl font-extrabold text-white mb-4 min-h-[90px] md:min-h-[128px]">
                {typedTitle}{isTyping && <span className="animate-ping">|</span>}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                Your central marketplace for high-quality, ready-to-use projects. Complete your final year project now, with our extensive collection of innovative and well-documented project solutions.
              </p>
              <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/projects">Explore Projects <ArrowRight className="ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in-up">
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
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(to_right,hsl(var(--background)),transparent_25%,transparent_75%,hsl(var(--background)))]" />
          <section id="projects" className="py-20">
              <div className="container mx-auto px-4 relative z-20">
                <header className="mb-12 text-center animate-fade-in-up">
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Featured Projects</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover and acquire high-quality, ready-to-use projects for your academic and professional needs.
                  </p>
                </header>
                
                 <div className="relative w-full max-w-4xl mx-auto">
                   <Carousel 
                      opts={{
                          align: "start",
                          loop: true,
                      }}
                      plugins={[plugin.current]}
                      onMouseEnter={() => plugin.current.stop()}
                      onMouseLeave={() => plugin.current.reset()}
                      className="w-full"
                  >
                      <CarouselContent className="-ml-1">
                          {projects.slice(0, 5).map((project, i) => (
                          <CarouselItem key={project.id} className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3">
                              <div className="p-1 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                  <ProjectCard project={project} isBlurred={!user && !loading} />
                              </div>
                          </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-[-50px] z-20" />
                      <CarouselNext className="right-[-50px] z-20" />
                  </Carousel>
                </div>
                
                <div className="text-center mt-12 animate-fade-in-up">
                  <Button asChild size="lg" variant="outline">
                    <Link href="/projects">
                      View All Projects <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
          </section>
        </div>


        {/* About Section */}
        <section id="about" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
               <div className="grid md:grid-cols-2 gap-16 items-center">
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
                <div className="animate-fade-in-left aspect-[4/3]">
                  <NodeGarden />
                </div>
              </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground mt-2">Find answers to common questions about our platform.</p>
            </div>
            <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="font-semibold text-lg hover:no-underline text-left">
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Contact Us</h2>
              <p className="text-lg text-muted-foreground mt-2">Have a question or feedback? Drop us a line! If you have a desired idea, or if you need any help, feel free to contact us.</p>
            </div>
            <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
                      <CardDescription>We typically respond within 24-48 hours.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Form {...form}>
                          <form onSubmit={form.handleSubmit(onContactSubmit)} className="space-y-6">
                              <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Your Name</FormLabel>
                                          <FormControl>
                                              <Input placeholder="John Doe" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Email Address</FormLabel>
                                          <FormControl>
                                              <Input type="email" placeholder="you@example.com" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="message"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Your Message</FormLabel>
                                          <FormControl>
                                              <Textarea
                                                  placeholder="Tell us what's on your mind..."
                                                  className="min-h-[150px]"
                                                  {...field}
                                              />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <div className="flex justify-end">
                                  <Button type="submit" disabled={isLoading} size="lg">
                                      {isLoading ? (
                                          <>
                                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                              Sending...
                                          </>
                                      ) : (
                                          <>
                                              <Send className="mr-2 h-5 w-5" />
                                              Send Message
                                          </>
                                      )}
                                  </Button>
                              </div>
                          </form>
                      </Form>
                  </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

    
    
