import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // backend server URL

export default function CreateItem() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    instructor: '',
    rating: '',
    reviews: '',
  });
  const [imageFile, setImageFile] = useState(null); // Selected image file
  const [imagePreview, setImagePreview] = useState(null); // For preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview image before upload
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return setError('Name is required');
    if (form.price === '' || isNaN(Number(form.price))) return setError('Price must be a number');
    if (form.rating === '' || isNaN(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5)
      return setError('Rating must be a number between 0 and 5');
    if (form.reviews === '' || isNaN(Number(form.reviews)) || Number(form.reviews) < 0)
      return setError('Reviews must be a non-negative number');

    try {
      setLoading(true);

      // Use FormData to send file and form data
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('description', form.description.trim());
      formData.append('price', Number(form.price));
      formData.append('instructor', form.instructor.trim());
      formData.append('rating', Number(form.rating));
      formData.append('reviews', Number(form.reviews));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await axios.post(`${API_BASE}/api/items`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(`✅ Created item (id: ${res.data._id})`);
      setForm({
        name: '',
        description: '',
        price: '',
        instructor: '',
        rating: '',
        reviews: '',
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !form.name.trim() ||
    form.price === '' ||
    isNaN(Number(form.price)) ||
    form.rating === '' ||
    isNaN(Number(form.rating)) ||
    Number(form.rating) < 0 ||
    Number(form.rating) > 5 ||
    form.reviews === '' ||
    isNaN(Number(form.reviews)) ||
    Number(form.reviews) < 0;

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '2rem auto',
        padding: 16,
        border: '1px solid #c7c1c1',
        borderRadius: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <h2>Create Item</h2>

      <form onSubmit={onSubmit}>
        {/* Name */}
        <div style={{ marginBottom: 12 }}>
          <label>Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g. Notebook"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Optional description"
            style={{ width: '100%', padding: 8, minHeight: 80 }}
          />
        </div>

        {/* Price */}
        <div style={{ marginBottom: 12 }}>
          <label>Price *</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={onChange}
            placeholder="e.g. 199"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {/* Instructor */}
        <div style={{ marginBottom: 12 }}>
          <label>Instructor</label>
          <input
            name="instructor"
            value={form.instructor}
            onChange={onChange}
            placeholder="Instructor name"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {/* Rating */}
        <div style={{ marginBottom: 12 }}>
          <label>Rating (0-5) *</label>
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={onChange}
            placeholder="e.g. 4.5"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {/* Reviews */}
        <div style={{ marginBottom: 12 }}>
          <label>Reviews *</label>
          <input
            name="reviews"
            type="number"
            min="0"
            step="1"
            value={form.reviews}
            onChange={onChange}
            placeholder="e.g. 10"
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: 12 }}>
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            style={{ width: '100%' }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image preview"
              style={{ marginTop: 8, maxHeight: 150, objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Error/Success */}
        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}

        <button
          type="submit"
          disabled={isDisabled}
          style={{
            padding: '8px 16px',
            backgroundColor: isDisabled ? '#9ca3af' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating…' : 'Create'}
        </button>
      </form>
    </div>
  );
}
