
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCard } from "@/components/project-card"
import { categories } from "@/lib/placeholder-data"
import { Search, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth";
import type { Project } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/firebase-services";
import { useToast } from "@/hooks/use-toast";

function ProjectsContent() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const fetchProjects = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    };
    fetchProjects();
  }, [toast]);

  useEffect(() => {
    let results = projects;
    
    const currentSearch = searchParams.get('q') || '';
    if (currentSearch) {
      results = results.filter(p => p.title.toLowerCase().includes(currentSearch.toLowerCase()));
    }

    const currentCategory = searchParams.get('category') || 'all';
    if (currentCategory !== 'all') {
      results = results.filter(p => p.category.toLowerCase().replace(" ", "-") === currentCategory);
    }
    
    setFilteredProjects(results);
    setSearchTerm(currentSearch);
    setCategory(currentCategory);

  }, [searchParams, projects]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('q', searchTerm);
    router.push(`/projects?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    setCategory(value);
    router.push(`/projects?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center animate-fade-in-down">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
          Project Marketplace
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and acquire high-quality, ready-to-use projects for your academic and professional needs.
        </p>
      </header>
      
      <form onSubmit={handleSearch} className="mb-8 flex flex-col md:flex-row gap-4 animate-fade-in-up">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            name="search"
            placeholder="Search for projects..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase().replace(" ", "-")}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Search</Button>
      </form>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, i) => (
          <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <ProjectCard project={project} isBlurred={!user && !loading} />
          </div>
        ))}
      </div>
      {filteredProjects.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground mt-12 animate-fade-in">No projects found matching your criteria.</p>
      )}
    </div>
  );
}


export default function ProjectsPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    }>
      <ProjectsContent />
    </Suspense>
  )
}
