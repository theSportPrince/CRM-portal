import React, { useState, useEffect } from "react";
import axios from "axios";

const Lead = ({ lead, fetchLeads }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);
  const [phone, setPhone] = useState(lead.phone);
  const [service, setService] = useState(lead.service);
  const [price, setPrice] = useState(lead.price);
  const [status, setStatus] = useState(lead.status);
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo);

  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user.role);
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const updateData =
      role === "user"
        ? { status, name, email, phone, service, price }
        : {
            name,
            email,
            phone,
            service,
            price,
            status,
            assignedTo: assignedTo || "",
          };

    await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/leads/update/${lead._id}`,
      updateData,
      {
        headers: { Authorization: token },
      }
    );
    setEditing(false);
    alert("Lead Updated Successfully")
    fetchLeads();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${process.env.REACT_APP_BASE_URL}/api/leads/delete/${lead._id}`,
      {
        headers: { Authorization: token },
      }
    );
    fetchLeads();
  };

  return (
    <div>
      {editing ? (
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>

          {role !== "user" && (
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          )}
          <button onClick={handleUpdate}>Update</button>
        </div>
      ) : (
        <div>
          <p>
            {lead.name} ({lead.email}) - {lead.status}
          </p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Lead;
