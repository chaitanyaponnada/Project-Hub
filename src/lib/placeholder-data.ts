
export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  price: number;
  originalPrice?: number;
  tags?: string[];
  imageUrls: string[];
  imageHints: string[];
  includedFiles: string[];
  downloadUrl: string; // Corresponds to user's "fileUrl"
  createdAt?: any;
};

export type Sale = {
    id: string;
    projectId: string;
    projectTitle: string;
    projectImageUrl: string;
    projectDownloadUrl: string;
    price: number;
    userId: string;
    userName: string;
    userEmail: string;
    userPhotoURL: string;
    purchasedAt: any;
}

export type Review = {
  id: string;
  rating: number;
  reviewerImageUrl: string;
  reviewerName: string;
  reviewText: string;
  projectName: string;
};


export const categories = [
  "Web Development",
  "Mobile App Development",
  "Machine Learning",
  "Data Science",
  "Robotics",
  "Game Development",
];

export const defaultTags = [
    "Selling Fast",
    "Most Purchased",
    "High-Level Project",
    "Beginner Friendly",
    "New!"
]

// 3 sample projects as requested
export const projects: Project[] = [
  {
    id: "1",
    title: "AI Shopping Assistant",
    description: "A web platform with an AI-powered assistant to help users find products.",
    category: "Web Development",
    technologies: ["React", "Firebase", "Genkit"],
    price: 150.00,
    imageUrls: ["https://picsum.photos/seed/sample1/800/600"],
    downloadUrl: "#", // Placeholder
    imageHints: [],
    includedFiles: [],
    tags: ["AI", "New!"],
  },
  {
    id: "2",
    title: "Mobile Fitness Planner",
    description: "A mobile app to create and track fitness plans.",
    category: "Mobile App Development",
    technologies: ["React Native", "Firebase"],
    price: 120.00,
    imageUrls: ["https://picsum.photos/seed/sample2/800/600"],
    downloadUrl: "#", // Placeholder
    imageHints: [],
    includedFiles: [],
    tags: ["Fitness", "Selling Fast"],
  },
  {
    id: "3",
    title: "Sentiment Analysis API",
    description: "A machine learning API that analyzes text sentiment.",
    category: "Machine Learning",
    technologies: ["Python", "Flask", "TensorFlow"],
    price: 200.00,
    imageUrls: ["https://picsum.photos/seed/sample3/800/600"],
    downloadUrl: "#", // Placeholder
    imageHints: [],
    includedFiles: [],
    tags: ["API", "High-Level Project"],
  }
];

export const faqs = [
  {
    question: "What do I get when I purchase a project?",
    answer: "You receive a full source code package, detailed documentation, and any necessary assets. The project is ready for you to deploy or customize further."
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Due to the digital nature of our products, all sales are final. We encourage you to review the project details and demos carefully before purchasing. If you encounter a technical issue, our support team is happy to help."
  },
  {
    question: "Are the projects beginner-friendly?",
    answer: "Our projects range from beginner to advanced levels. Each project's description includes the technologies used and its complexity, helping you choose one that matches your skill level."
  },
  {
    question: "How are the projects licensed?",
    answer: "All projects are licensed for personal and educational use. You can use them in your portfolio, for learning, or as a foundation for your own applications. Redistribution or commercial resale is not permitted."
  },
  {
    question: "Can you develop my custom project idea?",
    answer: "Absolutely! We love bringing new ideas to life. Contact us with your requirements, and we'll work with you to understand your vision, provide a quote, and deliver a high-quality, custom project within an agreed-upon timeframe.",
    highlight: true,
  },
  {
    question: "How long does it take to develop and deliver a custom project?",
    answer: "The timeline for a custom project depends on its complexity and your specific requirements. After our initial discussion, we'll provide a detailed project plan with key milestones and a final delivery date. We are committed to timely delivery without compromising on quality."
  }
];

export const reviews: Review[] = [
  {
    id: "review-1",
    rating: 5,
    reviewerImageUrl: "https://i.pravatar.cc/150?img=1",
    reviewerName: "Alex Johnson",
    reviewText: "Incredible value! The code was clean and the documentation was so easy to follow. Saved me weeks of work.",
    projectName: "AI Shopping Assistant"
  },
  {
    id: "review-2",
    rating: 5,
    reviewerImageUrl: "https://i.pravatar.cc/150?img=2",
    reviewerName: "Priya Sharma",
    reviewText: "The mobile fitness planner project was exactly what I needed for my portfolio. Highly recommended for students.",
    projectName: "Mobile Fitness Planner"
  },
  {
    id: "review-3",
    rating: 4,
    reviewerImageUrl: "https://i.pravatar.cc/150?img=3",
    reviewerName: "David Lee",
    reviewText: "A solid foundation for my sentiment analysis tool. The API was well-structured and easy to integrate.",
    projectName: "Sentiment Analysis API"
  },
  {
    id: "review-4",
    rating: 5,
    reviewerImageUrl: "https://i.pravatar.cc/150?img=4",
    reviewerName: "Maria Garcia",
    reviewText: "Project Hub is a lifesaver for B.Tech students. The quality of projects is top-notch. Will be back for more!",
    projectName: "AI Shopping Assistant"
  },
  {
    id: "review-5",
    rating: 4,
    reviewerImageUrl: "https://i.pravatar.cc/150?img=5",
    reviewerName: "Chen Wei",
    reviewText: "Great starting point. I was able to customize the fitness app easily and add my own features.",
    projectName: "Mobile Fitness Planner"
  }
];
