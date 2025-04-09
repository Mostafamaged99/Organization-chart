import React, { useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";

export default function ColoredDemo() {
  const [data, setData] = useState([
    {
      expanded: true,
      type: "person",
      className: "bg-primary text-white",
      style: { borderRadius: "12px" },
      data: {
        name: "Amy Elsner",
        title: "CEO",
      },
      children: [
        {
          expanded: true,
          type: "person",
          className: "bg-info text-white",
          style: { borderRadius: "12px" },
          data: {
            name: "Anna Fali",
            title: "CMO",
          },
          children: [
            {
              expanded: true,
              type: "person",
              className: "bg-info text-white",
              style: { borderRadius: "12px" },
              data: {
                name: "Ali Connors",
                title: "Sales Associate",
              },
            },
            {
              expanded: true,
              type: "person",
              className: "bg-info text-white",
              style: { borderRadius: "12px" },
              data: {
                name: "Yasser Dali",
                title: "Marketing Associate",
              },
            },
          ],
        },
        {
          expanded: true,
          type: "person",
          className: "bg-info text-white",
          style: { borderRadius: "12px" },
          data: {
            name: "Stephen Shaw",
            title: "CTO",
          },
          children: [
            {
              expanded: true,
              type: "person",
              className: "bg-info text-white",
              style: { borderRadius: "12px" },
              data: {
                name: "Yarah Ali",
                title: "Software Engineer",
              },
            },
            {
              expanded: true,
              type: "person",
              className: "bg-info text-white",
              style: { borderRadius: "12px" },
              data: {
                name: "Sara Smith",
                title: "AI Engineer",
              },
            },
          ],
        },
      ],
    },
  ]);

  // Function to handle adding a child node
  const addNode = (node) => {
    const newName = prompt("Enter name for the new node:");
    const newTitle = prompt("Enter title for the new node:");
    if (newName && newTitle) {
      const addChildNode = (currentNode) => {
        // Check if the current node has a data property
        if (currentNode.data && currentNode.data.name === node.data.name) {
          if (!currentNode.children) {
            currentNode.children = [];
          }
          currentNode.children.push({
            type: "person",
            className: "bg-info text-white",
            style: { borderRadius: "12px" },
            data: {
              name: newName,
              title: newTitle,
              image:
                "https://primefaces.org/cdn/primereact/images/avatar/default.png", // Default image
            },
            expanded: true,
            children: [],
          });
        } else if (currentNode.children) {
          currentNode.children.forEach(addChildNode);
        }
      };

      const updatedData = [...data];
      updatedData.forEach(addChildNode);
      setData(updatedData);
    }
  };

  // Function to handle editing a node
  const editNode = (node) => {
    const newName = prompt("Enter new name for the node:", node.data.name);
    const newTitle = prompt("Enter new title for the node:", node.data.title);
    if (newName && newTitle) {
      const updateNodeData = (currentNode) => {
        // Check if the current node has a data property
        if (currentNode.data && currentNode.data.name === node.data.name) {
          currentNode.data.name = newName;
          currentNode.data.title = newTitle;
        } else if (currentNode.children) {
          currentNode.children.forEach(updateNodeData);
        }
      };

      const updatedData = [...data];
      updatedData.forEach(updateNodeData);
      setData(updatedData);
    }
  };

  // Function to handle deleting a node
  const deleteNode = (node) => {
    const deleteNodeRecursively = (nodes, name) => {
      return nodes
        .map((currentNode) => {
          // Check if the current node has a data property
          if (currentNode.data && currentNode.data.name === name) {
            return null; // Remove the node
          } else if (currentNode.children) {
            currentNode.children = deleteNodeRecursively(
              currentNode.children,
              name
            );
          }
          return currentNode;
        })
        .filter((n) => n !== null); // Filter out null values
    };

    const updatedData = deleteNodeRecursively([...data], node.data.name);
    setData(updatedData);
  };

  const nodeTemplate = (node) => {
    if (node.type === "person") {
      return (
        <div className="d-flex flex-column p-2">
          <div className="d-flex flex-column align-items-center">
            <span className="fw-bold mb-2">{node.data.name}</span>
            <span>{node.data.title}</span>
            <div className="mt-2">
              <button
                className="btn btn-sm btn-success me-2"
                onClick={() => addNode(node)}
              >
                Add
              </button>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => editNode(node)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteNode(node)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    }

    return node.label;
  };

  return (
    <div className="card overflow-x-auto m-5 pt-3">
      <OrganizationChart value={data} nodeTemplate={nodeTemplate} />
    </div>
  );
}
