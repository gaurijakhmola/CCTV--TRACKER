import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function StationDetails({ token, stations, setStations }) {
  const { id } = useParams();
  const stationId = parseInt(id, 10);
  const station = stations.find(s => s.id === stationId);
  const [camerasInstalled, setCamerasInstalled] = useState(station?.camerasInstalled || 0);
  const [camerasPending, setCamerasPending] = useState(station?.camerasPending || 0);
  const [newComplaint, setNewComplaint] = useState('');
  const [error, setError] = useState('');
  const [msgSending, setMsgSending] = useState(false);

  if (!station) return <p>Station not found</p>;

  async function updateCameras() {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/update-cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stationId,
          camerasInstalled: Number(camerasInstalled),
          camerasPending: Number(camerasPending),
        }),
      });
      if (!res.ok) throw new Error('Failed to update cameras');
      const data = await res.json();
      updateStationState(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function addComplaint() {
    if (!newComplaint.trim()) {
      setError('Complaint text cannot be empty');
      return;
    }
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stationId, text: newComplaint }),
      });
      if (!res.ok) throw new Error('Failed to add complaint');
      const data = await res.json();
      updateStationState(data);
      setNewComplaint('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function requestStatusChange(complaintId, requestedStatus) {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/request-complaint-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stationId, complaintId, requestedStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to request status change');
      }
      const updatedComplaint = await res.json();
      updateStationComplaint(updatedComplaint);
    } catch (err) {
      setError(err.message);
    }
  }

  async function confirmStatusChange(complaintId, approve) {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/confirm-complaint-status-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stationId, complaintId, approve }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to confirm status change');
      }
      const updatedComplaint = await res.json();
      updateStationComplaint(updatedComplaint);
    } catch (err) {
      setError(err.message);
    }
  }

  async function approveResolve(complaintId) {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/approve-resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stationId, complaintId, approved: true }),
      });
      if (!res.ok) throw new Error('Failed to approve resolution');
      const data = await res.json();
      updateStationState(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendMessage(complaintId, from, message, setMessageFn) {
    if (!message.trim()) return;
    setMsgSending(true);
    try {
      const res = await fetch('http://localhost:4000/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stationId, complaintId, from, message }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      const updatedComplaint = await res.json();
      updateStationComplaint(updatedComplaint);
      setMessageFn('');
    } catch (err) {
      setError(err.message);
    } finally {
      setMsgSending(false);
    }
  }

  // Update state helpers
  function updateStationState(updatedStation) {
    setStations(prev =>
      prev.map(s => (s.id === updatedStation.id ? updatedStation : s))
    );
  }
  function updateStationComplaint(updatedComplaint) {
    setStations(prev =>
      prev.map(stn => {
        if (stn.id !== stationId) return stn;
        return {
          ...stn,
          complaints: stn.complaints.map(c =>
            c.id === updatedComplaint.id ? updatedComplaint : c
          ),
        };
      })
    );
  }

  return (
    <div>
      <h2>{station.name} Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section style={{ marginBottom: 30 }}>
        <h3>Camera Status</h3>
        {/* Maybe check user role from decoded JWT token on frontend as well if desired */}
        <div>
          <label>
            Installed:
            <input
              type="number"
              value={camerasInstalled}
              onChange={e => setCamerasInstalled(e.target.value)}
              min="0"
              style={{ marginLeft: 8, marginRight: 20 }}
            />
          </label>
          <label>
            Pending:
            <input
              type="number"
              value={camerasPending}
              onChange={e => setCamerasPending(e.target.value)}
              min="0"
              style={{ marginLeft: 8 }}
            />
          </label>
          <button onClick={updateCameras} style={{ marginLeft: 20 }}>
            Update
          </button>
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h3>Complaints</h3>
        <div style={{ marginBottom: 20 }}>
          <textarea
            placeholder="Add new complaint"
            value={newComplaint}
            onChange={e => setNewComplaint(e.target.value)}
            rows="3"
            style={{ width: '100%' }}
          />
          <button onClick={addComplaint} style={{ marginTop: 5 }}>
            Submit Complaint
          </button>
        </div>

        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Status</th>
              <th>Messages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {station.complaints.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>No complaints.</td></tr>
            ) : (
              station.complaints.map(complaint => (
                <ComplaintRow
                  key={complaint.id}
                  complaint={complaint}
                  onRequestStatusChange={requestStatusChange}
                  onConfirmStatusChange={confirmStatusChange}
                  onApproveResolve={approveResolve}
                  onSendMessage={sendMessage}
                  sendingMsg={msgSending}
                />
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ComplaintRow({
  complaint,
  onRequestStatusChange,
  onConfirmStatusChange,
  onApproveResolve,
  onSendMessage,
  sendingMsg
}) {
  const [msgText, setMsgText] = useState('');

  const hasPendingChange = complaint.pendingStatusChange != null;

  return (
    <tr>
      <td>{complaint.text}</td>
      <td>
        {complaint.status}
        {hasPendingChange && (
          <div style={{ fontWeight: 'bold', color: 'orange' }}>
            Pending: {complaint.pendingStatusChange}
          </div>
        )}
      </td>
      <td style={{ maxWidth: 300, overflowY: 'auto', maxHeight: 150 }}>
        {complaint.messages.length === 0 ? (
          <em>No messages</em>
        ) : (
          <ul style={{ paddingLeft: 15, margin: 0 }}>
            {complaint.messages.map((m, i) => (
              <li key={i}>
                <b>{m.from}</b>: {m.message}{' '}
                <small>({new Date(m.date).toLocaleString()})</small>
              </li>
            ))}
          </ul>
        )}

        <div>
          <input
            type="text"
            placeholder="Send message"
            value={msgText}
            onChange={e => setMsgText(e.target.value)}
            disabled={sendingMsg}
            style={{ width: '80%', marginRight: 5 }}
          />
          <button onClick={() => { onSendMessage(complaint.id, 'user', msgText, setMsgText) }}
            disabled={sendingMsg || !msgText.trim()}>
            Send
          </button>
        </div>
      </td>
      <td>
        {!hasPendingChange ? (
          <>
            <button onClick={() => onRequestStatusChange(complaint.id, 'processing')}>
              Request Processing
            </button>
            <br />
            <button onClick={() => onRequestStatusChange(complaint.id, 'resolved')}>
              Request Resolved
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onConfirmStatusChange(complaint.id, true)}>Approve Change</button>
            <br />
            <button onClick={() => onConfirmStatusChange(complaint.id, false)}>Reject Change</button>
          </>
        )}

        {complaint.status === 'resolved' && complaint.resolveRequest && (
          <div style={{ marginTop: 10 }}>
            <button onClick={() => onApproveResolve(complaint.id)}>Approve Resolution</button>
          </div>
        )}
      </td>
    </tr>
  );
}
