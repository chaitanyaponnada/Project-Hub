import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCard } from "@/components/project-card"
import { projects, categories } from "@/lib/placeholder-data"
import { Search } from "lucide-react"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
          B.Tech Project Marketplace
        </h1>
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
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}
