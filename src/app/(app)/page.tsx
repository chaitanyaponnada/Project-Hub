
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Feather, Zap, Target, Loader2, Send, Lightbulb } from "lucide-react";
import { categories, faqs } from "@/lib/placeholder-data";
import type { Project } from "@/lib/placeholder-data";
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
import { useState, useEffect, useRef } from "react";
import { ProjectCard } from "@/components/project-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useTheme } from "next-themes";
import { NodeGarden } from "@/components/node-garden";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProjects, addInquiry } from "@/lib/firebase-services";
import { cn } from "@/lib/utils";


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message must not exceed 1000 characters."),
});

const HeroBackground = () => {
  const { theme } = useTheme();
  const [videoSrc, setVideoSrc] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setVideoSrc(
        theme === 'dark'
          ? 'https://res.cloudinary.com/dagqmrniu/video/upload/v1759294420/12_lhizfb.mp4'
          : 'https://res.cloudinary.com/dagqmrniu/video/upload/v1759294376/2_lksdur.mp4'
      );
    }
  }, [theme, isClient]);

  if (!isClient) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-background z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      </div>
    );
  }

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
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const headlineFonts = ['font-headline', 'font-roboto-slab', 'font-orbitron', 'font-press-start', 'font-bebas-neue', 'font-pacifico'];
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentFontIndex((prevIndex) => (prevIndex + 1) % headlineFonts.length);
        setIsGlitching(false);
      }, 500); // Duration of the glitch effect
    }, 10000); // Change font every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast({
                title: "Error",
                description: "Could not fetch projects.",
                variant: "destructive"
            });
        } finally {
            setProjectsLoading(false);
        }
    };
    fetchProjects();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        message: form.getValues("message") || "",
      });
    }
  }, [user, form]);

  async function onContactSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await addInquiry(values, user?.uid);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      form.reset({
          ...form.getValues(),
          message: ''
      });
    } catch(e) {
       toast({
        title: "Error Sending Message",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="relative">
          <HeroBackground />
          <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
              <div className="relative z-20 pt-16 px-4">
              <div className="max-w-4xl mx-auto">
                  <h1 className={cn(
                      "text-5xl sm:text-7xl md:text-8xl font-extrabold text-white mb-4 animate-zoom-in-fade-in transition-all duration-1000",
                      headlineFonts[currentFontIndex],
                      isGlitching ? 'glitch' : ''
                  )} data-text="PROJECT HUB" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  PROJECT HUB
                  </h1>
                  
                  <div className="glowing-border-container animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                    <p className="text-md md:text-lg text-white max-w-3xl mx-auto">
                        Choose from Ready to use projects <span className="text-destructive font-bold">&lt;Or&gt;</span> get your idea developed by us
                    </p>
                  </div>
                  <p className="text-md md:text-lg text-white max-w-3xl mx-auto mt-4 animate-fade-in-down" style={{ animationDelay: '0.4s' }}>
                    Your one-stop hub for innovative, high-quality academic projects with complete documentation and PPTs.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up mt-8" style={{ animationDelay: '0.5s' }}>
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href="/projects">Explore Projects <ArrowRight className="ml-2" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link href="/contact">Contact Us</Link>
                  </Button>
                  </div>
              </div>
              </div>
          </section>

          <section className="relative py-20 px-10 md:px-20 overflow-hidden text-white">
            <div className="container mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-fade-in-left">
                  <h2 className="font-headline text-5xl md:text-6xl font-bold leading-tight with-gradient-underline-1 relative inline-block pb-2" style={{textShadow: '0 0 15px hsl(var(--primary)/0.2)'}}>
                    Your Idea<br/>We Develop
                  </h2>
                  <p className="text-xl text-muted-foreground mt-4">with our team</p>
                </div>
                <div className="animate-fade-in-right text-right">
                  <p className="font-noto-sans-telugu text-5xl md:text-6xl font-bold text-destructive">
                    మీ ఐడియా ని మేము డెవలప్ చేస్తాము
                  </p>
                </div>
              </div>
            </div>
          </section>
      </div>

       <div className="relative z-10 bg-background">
        {/* Features Section */}
        <section className="py-20 bg-muted/30 section-gradient">
           <div className="container mx-auto px-4 relative z-20">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Why Choose Project Hub?</h2>
              <p className="text-lg text-muted-foreground mt-2">Everything you need in one place.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
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
              <div className="p-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <Card className="p-8 h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="inline-block p-4 bg-primary text-primary-foreground rounded-full mb-4">
                    <Lightbulb className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2">Implement Your Idea</h3>
                  <p className="text-muted-foreground">Your vision, created and delivered by our expert team.</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 section-gradient">
            <div className="container mx-auto px-4 relative z-20">
              <header className="mb-12 text-center animate-fade-in-up">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Featured Projects</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover and acquire high-quality, ready-to-use projects for your academic and professional needs.
                </p>
              </header>
              
              {projectsLoading ? (
                <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Carousel 
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={() => plugin.current.stop()}
                    onMouseLeave={() => plugin.current.reset()}
                    className="w-full max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto"
                >
                    <CarouselContent className="-ml-4">
                        {projects.slice(0, 5).map((project, i) => (
                        <CarouselItem key={project.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                            <div className="p-1 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <ProjectCard project={project} isBlurred={!user && !loading} />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 sm:left-[-50px] z-20" />
                    <CarouselNext className="right-0 sm:right-[-50px] z-20" />
                </Carousel>
              )}
              
              <div className="text-center mt-12 animate-fade-in-up">
                <Button asChild size="lg" variant="outline">
                  <Link href="/projects">
                    View All Projects <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-muted/30 section-gradient">
            <div className="container mx-auto px-4 relative z-20">
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
                <div className="animate-fade-in-left aspect-[4/3] relative flex items-center justify-center">
                  <NodeGarden />
                  <div className="absolute flex flex-col items-center justify-center text-center z-10 pointer-events-none">
                      <Code className="h-16 w-16 text-primary mb-4" />
                      <h3 className="font-headline text-4xl font-bold text-primary">Project Hub</h3>
                  </div>
                </div>
              </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 section-gradient">
          <div className="container mx-auto px-4 relative z-20">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground mt-2">Find answers to common questions about our platform.</p>
            </div>
            <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq: any, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b">
                    <AccordionTrigger className={cn("font-semibold text-lg hover:no-underline text-left", faq.highlight && "text-destructive")}>{faq.question}</AccordionTrigger>
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
        <section id="contact" className="py-20 bg-muted/30 section-gradient">
          <div className="container mx-auto px-4 relative z-20">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Contact Us</h2>
              <p className="text-lg text-muted-foreground mt-2">Have a question or feedback? Drop us a line!</p>
              <p className="text-lg text-muted-foreground mt-2">
                <span className="text-highlight">If you have a desired idea</span>, or if you need any help, feel free to contact us.
              </p>
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
                            <div className="grid sm:grid-cols-2 gap-6">
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
                            </div>
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+91 98765 43210" {...field} />
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
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      </div>
    </>
  );
}

    

    

    
