
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
