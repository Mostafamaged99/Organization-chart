import fs from "fs";

// Load the base structure from your existing JSON file
const baseData = {
  expanded: true,
  type: "person",
  className: "bg-primary text-white",
  style: { borderRadius: "12px" },
  data: {
    name: "Amy Elsner",
    title: "CEO",
    employmentType: "Full-time", // Default employment type for the CEO
  },
  children: [],
};

// Global counter for sequential IDs
let idCounter = 1;

// Possible employment types
const employmentTypes = ["Full-time", "Part-time", "Freelance"];

// Function to generate a unique name, title, id, and employment type
const generateUniqueData = (name, title) => ({
  id: idCounter++, // Increment the global counter for each user
  name: name || `Person ${idCounter}`,
  title: title || `Title ${idCounter}`,
  employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)], // Random employment type
});

// Predefined positions for the hierarchy
const positions = {
  1: ["CTO", "CMO", "CFO"], // Level 1: Direct reports to CEO
  2: ["Engineering Manager", "Marketing Manager", "Finance Manager"], // Level 2
  3: ["Team Leader"], // Level 3
  4: ["Senior Engineer", "Senior Specialist", "Senior Accountant"], // Level 4
  5: ["Junior Engineer", "Junior Specialist", "Junior Accountant"], // Level 5
  6: ["Intern"], // Level 6
};

// Function to recursively generate children based on predefined positions
const generateChildren = (depth, maxDepth) => {
  if (depth > maxDepth) return [];

  const children = [];
  const titles = positions[depth] || []; // Get titles for the current depth
  for (let i = 0; i < titles.length; i++) {
    children.push({
      expanded: true,
      type: "person",
      className: "bg-info text-white",
      style: { borderRadius: "12px" },
      data: generateUniqueData(`Person ${idCounter}`, titles[i]),
      children: generateChildren(depth + 1, maxDepth),
    });
  }
  return children;
};

// Generate the organization structure
const generateOrganization = () => {
  const maxDepth = Object.keys(positions).length; // Maximum depth of the hierarchy

  const root = { ...baseData };
  root.data = generateUniqueData("Amy Elsner", "CEO"); // Assign the CEO
  root.children = generateChildren(1, maxDepth);

  return root;
};

// Generate the organization tree
const organization = generateOrganization();

// Save to a JSON file
const output = { organization: [organization] };
fs.writeFileSync("db.json", JSON.stringify(output, null, 2));

console.log("Generated JSON file with hierarchical positions tree: db.json");
