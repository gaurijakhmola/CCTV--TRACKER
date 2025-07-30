import { useState, useEffect } from "react";

const EmployeeDashboard = ({ token, userInfo }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Response form states
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState("processing");

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    // Filter complaints based on status
    if (filterStatus === "all") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter(c => c.status === filterStatus));
    }
  }, [complaints, filterStatus]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/all-complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setLoading(false);
    }
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      const response = await fetch("http://localhost:4000/api/complaint-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.id,
          message: responseMessage,
          status: responseStatus,
        }),
      });

      if (response.ok) {
        showMessage("Response sent successfully!", "success");
        setResponseMessage("");
        setSelectedComplaint(null);
        fetchComplaints(); // Refresh complaints
      } else {
        showMessage("Failed to send response", "error");
      }
    } catch (error) {
      showMessage("Error sending response", "error");
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
      transition: "box-shadow 0.3s ease",
    },
    complaintCardHover: {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
    filterContainer: {
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
      alignItems: "center",
    },
    filterButton: (active) => ({
      padding: "8px 16px",
      backgroundColor: active ? "#006fd6" : "#f8f9fa",
      color: active ? "white" : "#64707a",
      border: "1px solid " + (active ? "#006fd6" : "#dee2e6"),
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.3s ease",
    }),
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  }

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === "pending").length;
  const processingComplaints = complaints.filter(c => c.status === "processing").length;
  const resolvedComplaints = complaints.filter(c => c.status === "resolved").length;

  return (
    <div style={styles.container}>
      <h2>TCIL Employee Dashboard</h2>
      
      {message && <div style={styles.message(messageType)}>{message}</div>}

      <div style={styles.tabs}>
        <button
          style={styles.tab(activeTab === "overview")}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          style={styles.tab(activeTab === "complaints")}
          onClick={() => setActiveTab("complaints")}
        >
          📋 All Complaints
        </button>
        <button
          style={styles.tab(activeTab === "respond")}
          onClick={() => setActiveTab("respond")}
        >
          💬 Send Response
        </button>
      </div>

      {activeTab === "overview" && (
        <div style={styles.card}>
          <h3>System Overview</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{totalComplaints}</div>
              <div style={styles.statLabel}>Total Complaints</div>
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
              <div style={styles.statNumber}>{resolvedComplaints}</div>
              <div style={styles.statLabel}>Resolved Complaints</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "complaints" && (
        <div style={styles.card}>
          <h3>All Complaints ({filteredComplaints.length})</h3>
          
          <div style={styles.filterContainer}>
            <span style={{ fontWeight: "600", color: "#64707a" }}>Filter by status:</span>
            <button
              style={styles.filterButton(filterStatus === "all")}
              onClick={() => setFilterStatus("all")}
            >
              All ({totalComplaints})
            </button>
            <button
              style={styles.filterButton(filterStatus === "pending")}
              onClick={() => setFilterStatus("pending")}
            >
              Pending ({pendingComplaints})
            </button>
            <button
              style={styles.filterButton(filterStatus === "processing")}
              onClick={() => setFilterStatus("processing")}
            >
              Processing ({processingComplaints})
            </button>
            <button
              style={styles.filterButton(filterStatus === "resolved")}
              onClick={() => setFilterStatus("resolved")}
            >
              Resolved ({resolvedComplaints})
            </button>
          </div>

          {filteredComplaints.length === 0 ? (
            <p>No complaints found for the selected filter.</p>
          ) : (
            filteredComplaints.map((complaint) => (
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>
                    Station: {complaint.stationName || `Station ${complaint.stationId}`} | Created: {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                  <button
                    style={styles.buttonSecondary}
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setActiveTab("respond");
                    }}
                  >
                    💬 Respond
                  </button>
                </div>

                {complaint.responses && complaint.responses.length > 0 && (
                  <div style={{ backgroundColor: "#f8f9fa", padding: "12px", borderRadius: "6px", marginTop: "12px" }}>
                    <h6 style={{ margin: "0 0 8px 0", color: "#495057" }}>Previous Responses:</h6>
                    {complaint.responses.map((response) => (
                      <div key={response.id} style={{ 
                        borderLeft: "3px solid #006fd6", 
                        paddingLeft: "12px", 
                        marginBottom: "8px" 
                      }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>{response.message}</p>
                        <small style={{ color: "#6c757d" }}>
                          By: {response.employeeUsername} | {new Date(response.createdAt).toLocaleString()} | 
                          Status: <span style={{ fontWeight: "600" }}>{response.status}</span>
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "respond" && (
        <div style={styles.card}>
          <h3>Send Response to Complaint</h3>
          {selectedComplaint ? (
            <>
              <div style={{ 
                backgroundColor: "#f8f9fa", 
                padding: "16px", 
                borderRadius: "8px", 
                marginBottom: "20px",
                border: "1px solid #dee2e6"
              }}>
                <h4 style={{ margin: "0 0 8px 0" }}>{selectedComplaint.title}</h4>
                <p style={{ margin: "0 0 8px 0", color: "#64707a" }}>{selectedComplaint.description}</p>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={styles.priorityBadge(selectedComplaint.priority)}>
                    {selectedComplaint.priority.toUpperCase()}
                  </span>
                  <span style={styles.statusBadge(selectedComplaint.status)}>
                    {selectedComplaint.status.toUpperCase()}
                  </span>
                  <small style={{ color: "#6c757d" }}>
                    Station: {selectedComplaint.stationName || `Station ${selectedComplaint.stationId}`}
                  </small>
                </div>
              </div>

              <form onSubmit={handleSendResponse} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Response Message:</label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    style={styles.textarea}
                    placeholder="Enter your response to this complaint..."
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Update Status To:</label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    style={styles.select}
                  >
                    <option value="processing">Processing</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" style={styles.button}>
                    Send Response
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedComplaint(null);
                      setResponseMessage("");
                    }}
                    style={{ ...styles.button, backgroundColor: "#6c757d" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#64707a" }}>
              <p>Select a complaint from the "All Complaints" tab to respond to it.</p>
              <button
                style={styles.button}
                onClick={() => setActiveTab("complaints")}
              >
                📋 View All Complaints
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;