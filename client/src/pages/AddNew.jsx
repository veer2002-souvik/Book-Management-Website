import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AddNew() {
  const [form, setForm] = useState({ title: "", author: "", description: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [submitTime, setSubmitTime] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.time('Form Submission - Add Book');
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await axios.post(`${API_BASE_URL}/books`, form);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.timeEnd('Form Submission - Add Book');
      console.log(`Book added successfully in ${duration}ms`);
      console.log('New book:', response.data);
      
      setSubmitTime(duration);
      navigate("/view");
    } catch (error) {
      console.timeEnd('Form Submission - Add Book');
      console.error('Error adding book:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
      {submitTime > 0 && <p className="text-sm text-green-600 mb-2">Book added in {submitTime}ms</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Title" 
          className="block w-full border p-2 rounded"
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Author" 
          className="block w-full border p-2 rounded"
          value={form.author} 
          onChange={(e) => setForm({ ...form, author: e.target.value })} 
        />
        <textarea 
          placeholder="Description" 
          className="block w-full border p-2 rounded"
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
        />
        <select 
          className="block w-full border p-2 rounded"
          value={form.status} 
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="Completed">Completed</option>
          <option value="Reading">Reading</option>
        </select>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}

export default AddNew;