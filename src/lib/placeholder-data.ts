
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
  downloadUrl: string;
};

export const categories = [
  "Web Development",
  "Mobile App Development",
  "Machine Learning",
  "Data Science",
  "Robotics",
  "Game Development",
];

export const projects: Project[] = [
  {
    id: "1",
    title: "AI-Powered E-commerce Platform",
    description: "A full-featured e-commerce site using Next.js, with AI-driven product recommendations and a modern, responsive design.",
    category: "Web Development",
    technologies: ["Next.js", "React", "Tailwind CSS", "Firebase", "Genkit AI"],
    price: 150.00,
    originalPrice: 200.00,
    tags: ["Best Seller"],
    imageUrls: [
      "https://picsum.photos/seed/proj1-img1/800/600",
      "https://picsum.photos/seed/proj1-img2/800/600",
    ],
    imageHints: ["code abstract", "app dashboard"],
    includedFiles: ["Full Source Code (ZIP)", "Deployment Guide (PDF)", "API Documentation"],
    downloadUrl: "#"
  },
  {
    id: "2",
    title: "Mobile Fitness Tracker App",
    description: "A React Native app for tracking workouts, setting goals, and visualizing progress with beautiful charts and graphs.",
    category: "Mobile App Development",
    technologies: ["React Native", "Firebase", "Recharts"],
    price: 120.00,
    imageUrls: [
      "https://picsum.photos/seed/proj2-img1/800/600",
      "https://picsum.photos/seed/proj2-img2/800/600"
    ],
    imageHints: ["app mockup", "fitness tracker"],
    includedFiles: ["Full Source Code (ZIP)", "Setup Instructions (MD)"],
    downloadUrl: "#"
  },
  {
    id: "3",
    title: "Real-time Object Detection System",
    description: "A Python-based system using TensorFlow and OpenCV to detect objects in a live video stream with high accuracy.",
    category: "Machine Learning",
    technologies: ["Python", "TensorFlow", "OpenCV"],
    price: 250.00,
    originalPrice: 300.00,
    tags: ["New"],
    imageUrls: [
      "https://picsum.photos/seed/proj3-img1/800/600",
      "https://picsum.photos/seed/proj3-img2/800/600"
    ],
    imageHints: ["circuit board", "object detection"],
     includedFiles: ["Python Scripts", "Pre-trained Models", "Jupyter Notebooks"],
    downloadUrl: "#"
  },
  {
    id: "4",
    title: "Maze-Solving Robot Simulation",
    description: "A robotics project in Python where a simulated robot autonomously navigates and solves complex mazes using AI algorithms.",
    category: "Robotics",
    technologies: ["Python", "Pygame", "Q-Learning"],
    price: 90.00,
    imageUrls: [
      "https://picsum.photos/seed/proj4-img1/800/600",
      "https://picsum.photos/seed/proj4-img2/800/600"
    ],
    imageHints: ["robot arm", "maze"],
    includedFiles: ["Full Source Code (ZIP)", "Algorithm Explanation (PDF)"],
    downloadUrl: "#"
  },
  {
    id: "5",
    title: "Interactive Data Visualization Dashboard",
    description: "A web-based dashboard built with D3.js and React to create stunning, interactive visualizations from any dataset.",
    category: "Data Science",
    technologies: ["React", "D3.js", "Node.js"],
    price: 180.00,
    imageUrls: [
      "https://picsum.photos/seed/proj5-img1/800/600",
      "https://picsum.photos/seed/proj5-img2/800/600"
    ],
    imageHints: ["data visualization", "dashboard"],
    includedFiles: ["Full Source Code (ZIP)", "User Guide (PDF)"],
    downloadUrl: "#"
  },
   {
    id: "6",
    title: "3D Platformer Game Engine",
    description: "A simple yet powerful 3D game engine built from scratch using C++ and OpenGL, perfect for learning game development principles.",
    category: "Game Development",
    technologies: ["C++", "OpenGL", "GLM"],
    price: 220.00,
    tags: ["Popular"],
    imageUrls: [
      "https://picsum.photos/seed/proj6-img1/800/600",
      "https://picsum.photos/seed/proj6-img2/800/600"
    ],
    imageHints: ["3d render", "game world"],
    includedFiles: ["Full C++ Source Code", "Asset Files", "Build Instructions"],
    downloadUrl: "#"
  }
];


export const users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', joined: '2023-01-15', orders: 2, totalSpent: 270 },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', joined: '2023-02-20', orders: 1, totalSpent: 200 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', joined: '2023-03-05', orders: 3, totalSpent: 440 },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', joined: '2023-04-10', orders: 0, totalSpent: 0 },
  { id: '5', name: 'Ethan Davis', email: 'ethan@example.com', joined: '2023-05-25', orders: 5, totalSpent: 760 },
];

export const salesData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
  { name: "Aug", revenue: 6500 },
  { name: "Sep", revenue: 7500 },
  { name: "Oct", revenue: 8000 },
  { name: "Nov", revenue: 9000 },
  { name: "Dec", revenue: 8500 },
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
  }
];

export const inquiries = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', message: 'I have a question about the e-commerce platform. Can it be integrated with other payment gateways?', receivedAt: '2024-07-28' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', message: 'I am interested in the fitness tracker app but need to know if it supports watchOS.', receivedAt: '2024-07-27' },
    { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', message: 'The object detection system is impressive. Is it possible to get a consultation on customizing the model?', receivedAt: '2024-07-27' },
];
