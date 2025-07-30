import { useState, useEffect } from "react";

const StationHeadDashboard = ({ token, userInfo }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [cameraData, setCameraData] = useState({ pending: 0, installed: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Form states
  const [pendingCameras, setPendingCameras] = useState("");
  const [installedCameras, setInstalledCameras] = useState("");
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaintPriority, setComplaintPriority] = useState("medium");

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch camera data
      const cameraRes = await fetch(`http://localhost:4000/api/camera-data/${userInfo.assignedStationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cameraRes.ok) {
        const cameraData = await cameraRes.json();
        setCameraData(cameraData);
        setPendingCameras(cameraData.pending.toString());
        setInstalledCameras(cameraData.installed.toString());
      }

      // Fetch complaints
      const complaintsRes = await fetch("http://localhost:4000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (complaintsRes.ok) {
        const complaintsData = await complaintsRes.json();
        setComplaints(complaintsData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleUpdateCameras = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/update-cameras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stationId: userInfo.assignedStationId,
          pending: parseInt(pendingCameras),
          installed: parseInt(installedCameras),
        }),
      });

      if (response.ok) {
        setCameraData({ pending: parseInt(pendingCameras), installed: parseInt(installedCameras) });
        showMessage("Camera data updated successfully!", "success");
      } else {
        showMessage("Failed to update camera data", "error");
      }
    } catch (error) {
      showMessage("Error updating camera data", "error");
    }
  };

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: complaintTitle,
          description: complaintDescription,
          priority: complaintPriority,
          stationId: userInfo.assignedStationId,
        }),
      });

      if (response.ok) {
        showMessage("Complaint raised successfully!", "success");
        setComplaintTitle("");
        setComplaintDescription("");
        setComplaintPriority("medium");
        fetchData(); // Refresh complaints
      } else {
        showMessage("Failed to raise complaint", "error");
      }
    } catch (error) {
      showMessage("Error raising complaint", "error");
    }
  };

  const handleApproval = async (complaintId, responseId, action) => {
    try {
      const response = await fetch("http://localhost:4000/api/complaint-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintId,
          responseId,
          action, // 'approve' or 'decline'
        }),
      });

      if (response.ok) {
        showMessage(`Response ${action}d successfully!`, "success");
        fetchData(); // Refresh complaints
      } else {
        showMessage(`Failed to ${action} response`, "error");
      }
    } catch (error) {
      showMessage(`Error ${action}ing response`, "error");
    }
  };

  const styles = {
    container: {
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    tabs: {
      display: "flex",
      marginBottom: "24px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    tab: (active) => ({
      flex: 1,
      padding: "12px 20px",
      backgroundColor: active ? "#006fd6" : "#f5f7fa",
      color: active ? "white" : "#64707a",
      border: "none",
      cursor: "pointer",
      fontWeight: active ? "600" : "500",
      transition: "all 0.3s ease",
    }),
    card: {
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      marginBottom: "24px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "24px",
    },
    statCard: {
      background: "linear-gradient(135deg, #006fd6, #0093d4)",
      color: "white",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "14px",
      opacity: 0.9,
    },
    form: {
      display: "grid",
      gap: "16px",
    },
    inputGroup: {
      display: "grid",
      gap: "8px",
    },
    label: {
      fontWeight: "600",
      color: "#1b2232",
    },
    input: {
      padding: "12px",
      border: "1px solid #dee7f3",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "border-color 0.3s ease",
    },
    textarea: {
      padding: "12px",
      border: "1px solid #dee7f3",
      borderRadius: "8px",
      fontSize: "14px",
      minHeight: "100px",
      resize: "vertical",
    },
    select: {
      padding: "12px",
      border: "1px solid #dee7f3",
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: "white",
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#006fd6",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonSecondary: {
      padding: "8px 16px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      marginRight: "8px",
    },
    buttonDanger: {
      padding: "8px 16px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
    },
    message: (type) => ({
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "16px",
      backgroundColor: type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "#d1ecf1",
      color: type === "success" ? "#155724" : type === "error" ? "#721c24" : "#0c5460",
      border: `1px solid ${type === "success" ? "#c3e6cb" : type === "error" ? "#f5c6cb" : "#bee5eb"}`,
    }),
    complaintCard: {
      border: "1px solid #dee7f3",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
    },
    statusBadge: (status) => ({
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: 
        status === "resolved" ? "#28a745" :
        status === "processing" ? "#ffc107" : "#6c757d",
      color: status === "processing" ? "#000" : "white",
    }),
    priorityBadge: (priority) => ({
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: "600",
      backgroundColor: 
        priority === "high" ? "#dc3545" :
        priority === "medium" ? "#ffc107" : "#28a745",
      color: priority === "medium" ? "#000" : "white",
    }),
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  }

  const completedComplaints = complaints.filter(c => c.status === "resolved").length;
  const pendingComplaints = complaints.filter(c => c.status === "pending").length;
  const processingComplaints = complaints.filter(c => c.status === "processing").length;

  return (
    <div style={styles.container}>
      <h2>Station Head Dashboard</h2>
      
      {message && <div style={styles.message(messageType)}>{message}</div>}

      <div style={styles.tabs}>
        <button
          style={styles.tab(activeTab === "overview")}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          style={styles.tab(activeTab === "cameras")}
          onClick={() => setActiveTab("cameras")}
        >
          🎥 Update Cameras
        </button>
        <button
          style={styles.tab(activeTab === "complaint")}
          onClick={() => setActiveTab("complaint")}
        >
          📝 Raise Complaint
        </button>
        <button
          style={styles.tab(activeTab === "complaints")}
          onClick={() => setActiveTab("complaints")}
        >
          📋 My Complaints
        </button>
      </div>

      {activeTab === "overview" && (
        <div style={styles.card}>
          <h3>Station Overview</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{cameraData.pending}</div>
              <div style={styles.statLabel}>Pending Cameras</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{cameraData.installed}</div>
              <div style={styles.statLabel}>Installed Cameras</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{pendingComplaints}</div>
              <div style={styles.statLabel}>Pending Complaints</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{processingComplaints}</div>
              <div style={styles.statLabel}>Processing Complaints</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{completedComplaints}</div>
              <div style={styles.statLabel}>Resolved Complaints</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cameras" && (
        <div style={styles.card}>
          <h3>Update Camera Information</h3>
          <form onSubmit={handleUpdateCameras} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Pending Cameras:</label>
              <input
                type="number"
                value={pendingCameras}
                onChange={(e) => setPendingCameras(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Installed Cameras:</label>
              <input
                type="number"
                value={installedCameras}
                onChange={(e) => setInstalledCameras(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>
              Update Camera Data
            </button>
          </form>
        </div>
      )}

      {activeTab === "complaint" && (
        <div style={styles.card}>
          <h3>Raise New Complaint</h3>
          <form onSubmit={handleRaiseComplaint} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Complaint Title:</label>
              <input
                type="text"
                value={complaintTitle}
                onChange={(e) => setComplaintTitle(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Description:</label>
              <textarea
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                style={styles.textarea}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Priority:</label>
              <select
                value={complaintPriority}
                onChange={(e) => setComplaintPriority(e.target.value)}
                style={styles.select}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button type="submit" style={styles.button}>
              Raise Complaint
            </button>
          </form>
        </div>
      )}

      {activeTab === "complaints" && (
        <div style={styles.card}>
          <h3>My Complaints ({complaints.length})</h3>
          {complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint.id} style={styles.complaintCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ margin: 0 }}>{complaint.title}</h4>
                  <div>
                    <span style={styles.priorityBadge(complaint.priority)}>{complaint.priority.toUpperCase()}</span>
                    {" "}
                    <span style={styles.statusBadge(complaint.status)}>{complaint.status.toUpperCase()}</span>
                  </div>
                </div>
                <p style={{ color: "#64707a", marginBottom: "12px" }}>{complaint.description}</p>
                <p style={{ fontSize: "12px", color: "#999", marginBottom: "12px" }}>
                  Created: {new Date(complaint.createdAt).toLocaleString()}
                </p>
                
                {complaint.responses && complaint.responses.length > 0 && (
                  <div>
                    <h5>Employee Responses:</h5>
                    {complaint.responses.map((response) => (
                      <div key={response.id} style={{ 
                        backgroundColor: "#f8f9fa", 
                        padding: "12px", 
                        borderRadius: "6px", 
                        marginBottom: "8px",
                        border: "1px solid #dee2e6"
                      }}>
                        <p style={{ margin: "0 0 8px 0" }}>{response.message}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <small style={{ color: "#6c757d" }}>
                            By: {response.employeeUsername} | {new Date(response.createdAt).toLocaleString()}
                          </small>
                          {response.status === "pending" && (
                            <div>
                              <button
                                style={styles.buttonSecondary}
                                onClick={() => handleApproval(complaint.id, response.id, "approve")}
                              >
                                ✅ Approve
                              </button>
                              <button
                                style={styles.buttonDanger}
                                onClick={() => handleApproval(complaint.id, response.id, "decline")}
                              >
                                ❌ Decline
                              </button>
                            </div>
                          )}
                          {response.status === "approved" && (
                            <span style={{ color: "#28a745", fontWeight: "600" }}>✅ Approved</span>
                          )}
                          {response.status === "declined" && (
                            <span style={{ color: "#dc3545", fontWeight: "600" }}>❌ Declined</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StationHeadDashboard;