import React, { useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit"
  const [currentNode, setCurrentNode] = useState(null);
  const [formData, setFormData] = useState({ name: "", title: "" });

  const handleShowModal = (type, node) => {
    setModalType(type);
    setCurrentNode(node);
    if (type === "edit") {
      setFormData({ name: node.data.name, title: node.data.title });
    } else {
      setFormData({ name: "", title: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", title: "" });
  };

  const handleSave = () => {
    if (modalType === "add") {
      addNode(currentNode, formData.name, formData.title);
    } else if (modalType === "edit") {
      editNode(currentNode, formData.name, formData.title);
    }
    handleCloseModal();
  };

  const addNode = (node, newName, newTitle) => {
    const addChildNode = (currentNode) => {
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
  };

  const editNode = (node, newName, newTitle) => {
    const updateNodeData = (currentNode) => {
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
  };

  const deleteNode = (node) => {
    const deleteNodeRecursively = (nodes, name) => {
      return nodes
        .map((currentNode) => {
          if (currentNode.data && currentNode.data.name === name) {
            return null;
          } else if (currentNode.children) {
            currentNode.children = deleteNodeRecursively(
              currentNode.children,
              name
            );
          }
          return currentNode;
        })
        .filter((n) => n !== null);
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
                onClick={() => handleShowModal("add", node)}
              >
                Add
              </button>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleShowModal("edit", node)}
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

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Add Node" : "Edit Node"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
