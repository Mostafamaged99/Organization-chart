import React, { useEffect, useState, useRef } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { Modal, Button, Form } from "react-bootstrap";
import { getData } from "../services/apiSevices";
import { Dropdown } from "react-bootstrap";
import { ThreeDots, Pencil, Eye, Pause, Trash } from "react-bootstrap-icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function ColoredDemo() {
  const [orgData, setOrgData] = useState(null); // Initialize as null
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit"
  const [currentNode, setCurrentNode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    employmentType: "Full-time",
  });

  const ceoRef = useRef(null); // Reference to the CEO card
  const transformRef = useRef(null); // Reference to the TransformWrapper

  useEffect(() => {
    getData("organization")
      .then((res) => {
        setOrgData(res.data);
        console.log("data", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (orgData && ceoRef.current && transformRef.current) {
      // Center the view on the CEO card after the data is loaded
      const { offsetLeft, offsetTop } = ceoRef.current;
      transformRef.current.centerView(offsetLeft, offsetTop);
    }
  }, [orgData]);

  const handleChartLoad = () => {
    if (ceoRef.current && transformRef.current) {
      const { offsetTop } = ceoRef.current;
      transformRef.current.centerView(0, offsetTop);
    }
  };

  const handleShowModal = (type, node) => {
    setModalType(type);
    setCurrentNode(node);
    if (type === "edit") {
      setFormData({
        name: node.data.name,
        title: node.data.title,
        employmentType: node.data.employmentType,
      });
    } else {
      setFormData({ name: "", title: "", employmentType: "Full-time" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", title: "", employmentType: "Full-time" });
  };

  const handleSave = () => {
    if (modalType === "add") {
      addNode(
        currentNode,
        formData.name,
        formData.title,
        formData.employmentType
      );
    } else if (modalType === "edit") {
      editNode(
        currentNode,
        formData.name,
        formData.title,
        formData.employmentType
      );
    }
    handleCloseModal();
  };

  const addNode = (node, newName, newTitle, newEmploymentType) => {
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
            employmentType: newEmploymentType,
          },
          expanded: true,
          children: [],
        });
      } else if (currentNode.children) {
        currentNode.children.forEach(addChildNode);
      }
    };
    const updatedData = [...orgData];
    updatedData.forEach(addChildNode);
    setOrgData(updatedData);
  };

  const editNode = (node, newName, newTitle, newEmploymentType) => {
    const updateNodeData = (currentNode) => {
      if (currentNode.data && currentNode.data.name === node.data.name) {
        currentNode.data.name = newName;
        currentNode.data.title = newTitle;
        currentNode.data.employmentType = newEmploymentType;
      } else if (currentNode.children) {
        currentNode.children.forEach(updateNodeData);
      }
    };
    const updatedData = [...orgData];
    updatedData.forEach(updateNodeData);
    setOrgData(updatedData);
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
    const updatedData = deleteNodeRecursively([...orgData], node.data.name);
    setOrgData(updatedData);
  };

  const nodeTemplate = (node) => {
    if (node.type === "person") {
      return (
        <div
          ref={node.data.title === "CEO" ? ceoRef : null}
          className="position-relative shadow-sm p-3 bg-white rounded"
          style={{ minWidth: "240px", borderTop: "3px solid #007bff" }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex flex-column">
              <small className="text-primary">
                {node.children.length > 0 ? node.children.length : "No"}{" "}
                Positions Below
              </small>
            </div>

            <div className="d-flex align-items-center gap-1">
              {/* Add Button */}
              <button
                className="btn btn-sm text-primary fs-4 fw-bold p-0"
                onClick={() => handleShowModal("add", node)}
                style={{
                  background: "transparent",
                  border: "none",
                  lineHeight: "1",
                }}
              >
                +
              </button>

              {/* Dropdown Menu */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  variant="light"
                  className="p-0 border-0 bg-transparent shadow-none"
                  style={{ lineHeight: 0, cursor: "pointer" }}
                >
                  <ThreeDots className="fs-5 text-muted" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-sm border-0">
                  <Dropdown.Item onClick={() => handleShowModal("edit", node)}>
                    <Pencil className="me-2" /> Edit
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Eye className="me-2" /> View
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Pause className="me-2" /> On Hold
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => deleteNode(node)}
                    className="text-danger"
                  >
                    <Trash className="me-2" /> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Content Section */}
          <div className="d-flex flex-column">
            <h6 className="fw-semibold text-dark align-self-start">
              {node.data.title}
            </h6>
            <hr className="text-dark py-0 my-0" />
            <p className="text-muted align-self-start my-2">
              <small>{node.data.employmentType}</small>
            </p>
            <hr className="text-dark py-0 my-0" />
            <small className="text-primary align-self-end fw-semibold mt-2">
              Assign Employee
            </small>
          </div>
        </div>
      );
    }
    return node.label;
  };

  return (
    <div
      className="card overflow-x-auto m-5 pt-3"
      style={{ width: "100vw", height: "100vh" }}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.1}
        maxScale={3}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "white",
                padding: "8px",
                borderRadius: "4px",
                zIndex: 100,
              }}
            >
              <button onClick={() => zoomIn()} className="btn btn-primary me-2">
                Zoom In
              </button>
              <button
                onClick={() => zoomOut()}
                className="btn btn-primary me-2"
              >
                Zoom Out
              </button>
              <button
                onClick={() => {
                  if (ceoRef.current && transformRef.current) {
                    const { offsetTop } = ceoRef.current;
                    transformRef.current.centerView(0, offsetTop);
                  }
                }}
                className="btn btn-secondary"
              >
                Reset
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100vh",
              }}
              contentStyle={{
                width: "fit-content",
                height: "fit-content",
              }}
            >
              <div className="card overflow-x-auto m-5 pt-3">
                {orgData ? (
                  <OrganizationChart
                    value={orgData}
                    nodeTemplate={nodeTemplate}
                    onLoad={handleChartLoad}
                  />
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

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
            <Form.Group className="mb-3">
              <Form.Label>Employment Type</Form.Label>
              <Form.Select
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData({ ...formData, employmentType: e.target.value })
                }
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
              </Form.Select>
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
