export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  price: number;
  imageUrls: string[];
  imageHints: string[];
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
    title: "E-commerce Platform for Artisans",
    description: "A full-featured e-commerce website built with the MERN stack, allowing local artisans to sell their handmade goods. Includes user authentication, product management, a shopping cart, and Stripe integration for payments.",
    category: "Web Development",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    price: 150,
    imageUrls: ["https://picsum.photos/seed/proj1/600/400", "https://picsum.photos/seed/proj1-2/600/400"],
    imageHints: ["code abstract", "online store"]
  },
  {
    id: "2",
    title: "Fitness Tracker Mobile App",
    description: "A cross-platform mobile application developed with React Native that allows users to track their workouts, set fitness goals, and view their progress over time. Integrates with device sensors to monitor activity.",
    category: "Mobile App Development",
    technologies: ["React Native", "Firebase", "Redux"],
    price: 120,
    imageUrls: ["https://picsum.photos/seed/proj5/600/400", "https://picsum.photos/seed/proj5-2/600/400"],
    imageHints: ["app mockup", "fitness tracker"]
  },
  {
    id: "3",
    title: "Real-time Object Detection System",
    description: "A machine learning project that uses Python, TensorFlow, and OpenCV to detect and classify objects in a live video stream. Trained on the COCO dataset, it can identify a wide range of common objects with high accuracy.",
    category: "Machine Learning",
    technologies: ["Python", "TensorFlow", "OpenCV", "Jupyter"],
    price: 200,
    imageUrls: ["https://picsum.photos/seed/proj2/600/400", "https://picsum.photos/seed/proj2-2/600/400"],
    imageHints: ["circuit board", "object detection"]
  },
  {
    id: "4",
    title: "Autonomous Maze-Solving Robot",
    description: "A robotics project featuring a robot built with Arduino and various sensors. It uses a pathfinding algorithm like A* to navigate and solve complex mazes autonomously.",
    category: "Robotics",
    technologies: ["Arduino", "C++", "A* Algorithm"],
    price: 180,
    imageUrls: ["https://picsum.photos/seed/proj3/600/400", "https://picsum.photos/seed/proj3-2/600/400"],
    imageHints: ["robot arm", "maze"]
  },
  {
    id: "5",
    title: "Interactive Data Visualization Dashboard",
    description: "A web-based dashboard created with D3.js and React that provides interactive visualizations for large datasets. Users can filter, sort, and explore data through dynamic charts and graphs.",
    category: "Data Science",
    technologies: ["React", "D3.js", "Next.js"],
    price: 130,
    imageUrls: ["https://picsum.photos/seed/proj4/600/400", "https://picsum.photos/seed/proj4-2/600/400"],
    imageHints: ["data visualization", "dashboard"]
  },
  {
    id: "6",
    title: "3D Platformer Game",
    description: "A 3D platformer game built with the Unity engine. Features multiple levels, character controls, physics-based puzzles, and enemy AI. All assets are custom-made or licensed for use.",
    category: "Game Development",
    technologies: ["Unity", "C#", "Blender"],
    price: 160,
    imageUrls: ["https://picsum.photos/seed/proj6/600/400", "https://picsum.photos/seed/proj6-2/600/400"],
    imageHints: ["3d render", "game world"]
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
