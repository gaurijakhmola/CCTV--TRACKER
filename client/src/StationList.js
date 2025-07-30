import { Link } from 'react-router-dom';

export default function StationList({ stations }) {
  return (
    <div>
      <h2>Police Stations</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cameras Installed</th>
            <th>Cameras Pending</th>
            <th>Complaints</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stations.map(station => (
            <tr key={station.id}>
              <td>{station.name}</td>
              <td>{station.camerasInstalled}</td>
              <td>{station.camerasPending}</td>
              <td>{station.complaints.length}</td>
              <td>
                <Link to={`/dashboard/station/${station.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
