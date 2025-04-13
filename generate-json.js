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
  },
  children: [],
};

// Function to generate a unique name and title
const generateUniqueData = (index) => ({
  name: `Person ${index}`,
  title: `Title ${index}`,
});

// Function to recursively generate children
const generateChildren = (parentIndex, depth, maxDepth, maxChildren) => {
  if (depth > maxDepth) return [];

  const children = [];
  for (let i = 1; i <= maxChildren; i++) {
    const childIndex = `${parentIndex}.${i}`;
    children.push({
      expanded: true,
      type: "person",
      className: "bg-info text-white",
      style: { borderRadius: "12px" },
      data: generateUniqueData(childIndex),
      children: generateChildren(childIndex, depth + 1, maxDepth, maxChildren),
    });
  }
  return children;
};

// Generate the organization structure
const generateOrganization = (totalRecords) => {
  const maxDepth = 3; // Maximum depth of the hierarchy
  const maxChildren = Math.ceil(totalRecords ** (1 / maxDepth)); // Approximate number of children per node

  const root = { ...baseData };
  root.children = generateChildren(1, 1, maxDepth, maxChildren);

  return root;
};

// Generate 5000 records
const organization = generateOrganization(5000);

// Save to a JSON file
const output = { organization: [organization] };
fs.writeFileSync("db.json", JSON.stringify(output, null, 2));

console.log("Generated JSON file with 5000 records: db.json");
