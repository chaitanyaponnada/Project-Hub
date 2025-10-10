
export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  projectType: string;
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
  reviewerDesignation: string;
  reviewerLocation: string;
  reviewText: string;
  projectName: string;
  reviewTitle?: string;
  createdAt?: any;
  lastUpdatedAt?: any;
};

export type PurchaseRequest = {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  requestedAt: any;
  status: 'pending' | 'contacted';
};


export const categories = [
  "Web Development",
  "Mobile App Development",
  "Machine Learning",
  "Data Science",
  "Robotics",
  "Game Development",
];

export const projectTypes = ["Major Project", "Mini Project"];

export const defaultTags = [
    "Selling Fast",
    "Most Purchased",
    "High-Level Project",
    "Beginner Friendly",
    "New!"
]

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
