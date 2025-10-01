
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

// This is now legacy data and will not be used by the app.
// It is kept here for reference or fallback if needed.
export const projects: Project[] = [];


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
