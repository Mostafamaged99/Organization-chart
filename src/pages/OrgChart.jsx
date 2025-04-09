import React, { useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";

function OrgChart() {
  const [data, setData] = useState([
    {
      key: "0",
      label: "CEO",
      expanded: true,
      children: [
        {
          key: "0_0",
          label: "CFO",
          expanded: true,
          children: [
            { key: "0_0_0", label: "Finance Manager" },
            { key: "0_0_1", label: "Legal Advisor" },
          ],
        },
        {
          key: "0_1",
          label: "CTO",
          expanded: true,
          children: [
            { key: "0_1_0", label: "Development Manager", expanded: true },
            { key: "0_1_1", label: "QA Manager", expanded: true },
          ],
        },
      ],
    },
  ]);

  const addNode = (e) => {
    console.log(e.node);
    e.node.expanded = true;
    const newNode = {
      label: "New Node",
      expanded: true,
      children: [],
    };

    if (e.node.children) {
      e.node.children.push(newNode); // Add node on right side
      e.node.expanded = true;
      //   e.node.children.unshift(newNode); // Add node on left side
    } else {
      e.node.children = [newNode];
    }

    setData([...data]);
  };

  const nodeTemplate = (node) => {
    return (
      <div className="p-3 border rounded text-center bg-primary text-white">
        <strong>{node.label}</strong>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <OrganizationChart
        value={data}
        nodeTemplate={nodeTemplate}
        selectionMode="single"
        onNodeSelect={addNode}
        className="border pt-4 bg-light"
      />
    </div>
  );
}

export default OrgChart;
