import { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageContacts.css'

function ManageContacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/contact/all')
      .then((res) => setContacts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="contacts-container mt-5">
      <h2>Contact Requests</h2>
      <table className="contacts-table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Request</th><th>Service</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.request}</td>
              <td>{item.service}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageContacts;
