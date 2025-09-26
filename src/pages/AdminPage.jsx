import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPage.css'; // Add this CSS file for styling
const API_BASE = 'http://localhost:5000';
export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit states
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  
  // Create states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    price: '',
    instructor: '',
    rating: '',
    reviews: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  
  // Fetch all items on mount
  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/items`);
        setItems(res.data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);
  
  // Clean up image preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  
  // Delete item
  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`${API_BASE}/api/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed');
    }
  };
  
  // Update item
  const updateItem = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!editingItem.name.trim()) {
      setEditError('Name is required');
      return;
    }
    if (editingItem.price === '' || isNaN(Number(editingItem.price))) {
      setEditError('Price must be a number');
      return;
    }
    if (editingItem.rating === '' || isNaN(Number(editingItem.rating)) || 
        Number(editingItem.rating) < 0 || Number(editingItem.rating) > 5) {
      setEditError('Rating must be a number between 0 and 5');
      return;
    }
    if (editingItem.reviews === '' || isNaN(Number(editingItem.reviews)) || 
        Number(editingItem.reviews) < 0) {
      setEditError('Reviews must be a non-negative number');
      return;
    }
    
    try {
      setEditLoading(true);
      setEditError('');
      
      const formData = new FormData();
      formData.append('name', editingItem.name.trim());
      formData.append('description', editingItem.description || '');
      formData.append('price', Number(editingItem.price));
      formData.append('instructor', editingItem.instructor || '');
      formData.append('rating', Number(editingItem.rating));
      formData.append('reviews', Number(editingItem.reviews));
      
      // If there's a new image file, append it
      if (editingItem.imageFile) {
        formData.append('image', editingItem.imageFile);
      }
      
      // REMOVED the headers property - Axios will set it automatically
      const res = await axios.put(`${API_BASE}/api/items/${editingItem._id}`, formData);
      
      setEditSuccess('✅ Course updated successfully!');
      setItems(items.map(item => item._id === editingItem._id ? res.data : item));
      
      // Close modal after successful update
      setTimeout(() => {
        setShowEditModal(false);
        setEditingItem(null);
        setEditSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Update error:', err.response?.data || err);
      setEditError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };
  
  // Create item
  const createItem = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!createForm.name.trim()) {
      setCreateError('Name is required');
      return;
    }
    if (createForm.price === '' || isNaN(Number(createForm.price))) {
      setCreateError('Price must be a number');
      return;
    }
    if (createForm.rating === '' || isNaN(Number(createForm.rating)) || 
        Number(createForm.rating) < 0 || Number(createForm.rating) > 5) {
      setCreateError('Rating must be a number between 0 and 5');
      return;
    }
    if (createForm.reviews === '' || isNaN(Number(createForm.reviews)) || 
        Number(createForm.reviews) < 0) {
      setCreateError('Reviews must be a non-negative number');
      return;
    }
    
    try {
      setCreateLoading(true);
      setCreateError('');
      
      const formData = new FormData();
      formData.append('name', createForm.name.trim());
      formData.append('description', createForm.description.trim());
      formData.append('price', Number(createForm.price));
      formData.append('instructor', createForm.instructor.trim());
      formData.append('rating', Number(createForm.rating));
      formData.append('reviews', Number(createForm.reviews));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // REMOVED the headers property - Axios will set it automatically
      const res = await axios.post(`${API_BASE}/api/items`, formData);
      
      setCreateSuccess(`✅ Course created successfully!`);
      setItems([...items, res.data]);
      
      // Reset form
      setCreateForm({
        name: '',
        description: '',
        price: '',
        instructor: '',
        rating: '',
        reviews: '',
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Close modal after successful creation
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Create error:', err.response?.data || err);
      setCreateError(err.response?.data?.message || err.message || 'Server error');
    } finally {
      setCreateLoading(false);
    }
  };
  
  // Edit handlers
  const openEditModal = (item) => {
    setEditingItem({
      ...item,
      imageFile: null, // Reset image file when opening edit modal
      imagePreview: null // Reset image preview
    });
    setShowEditModal(true);
    setEditError('');
    setEditSuccess('');
  };
  
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setEditError('');
    setEditSuccess('');
  };
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };
  
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clean up previous preview if exists
      if (editingItem.imagePreview) {
        URL.revokeObjectURL(editingItem.imagePreview);
      }
      
      setEditingItem({
        ...editingItem,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };
  
  // Create handlers
  const openCreateModal = () => {
    setShowCreateModal(true);
    setCreateError('');
    setCreateSuccess('');
  };
  
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateError('');
    setCreateSuccess('');
    // Clean up image preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };
  
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
    setCreateError('');
    setCreateSuccess('');
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clean up previous preview if exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // Check if create form is valid
  const isCreateDisabled =
    createLoading ||
    !createForm.name.trim() ||
    createForm.price === '' ||
    isNaN(Number(createForm.price)) ||
    createForm.rating === '' ||
    isNaN(Number(createForm.rating)) ||
    Number(createForm.rating) < 0 ||
    Number(createForm.rating) > 5 ||
    createForm.reviews === '' ||
    isNaN(Number(createForm.reviews)) ||
    Number(createForm.reviews) < 0;
  
  // Check if edit form is valid
  const isEditDisabled =
    editLoading ||
    !editingItem?.name?.trim() ||
    editingItem?.price === '' ||
    isNaN(Number(editingItem?.price)) ||
    editingItem?.rating === '' ||
    isNaN(Number(editingItem?.rating)) ||
    Number(editingItem?.rating) < 0 ||
    Number(editingItem?.rating) > 5 ||
    editingItem?.reviews === '' ||
    isNaN(Number(editingItem?.reviews)) ||
    Number(editingItem?.reviews) < 0;
  
  if (loading) return <div className="loading-container">Loading courses...</div>;
  if (error) return <div className="error-container">{error}</div>;
  
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard - Manage Courses</h2>
        <button 
          onClick={openCreateModal}
          className="btn btn-primary"
        >
          Add New Course
        </button>
      </div>
      
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Instructor</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="6">No courses found</td></tr>
            ) : (
              items.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.instructor || '-'}</td>
                  <td>{item.rating || '-'}</td>
                  <td>{item.reviews || '-'}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => openEditModal(item)} 
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteItem(item._id)} 
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Course</h3>
            <form onSubmit={updateItem}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingItem.name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editingItem.description || ''}
                  onChange={handleEditInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={editingItem.price}
                  onChange={handleEditInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Instructor</label>
                <input
                  type="text"
                  name="instructor"
                  value={editingItem.instructor || ''}
                  onChange={handleEditInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Rating (0-5) *</label>
                <input
                  type="number"
                  name="rating"
                  value={editingItem.rating || ''}
                  onChange={handleEditInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label>Reviews *</label>
                <input
                  type="number"
                  name="reviews"
                  value={editingItem.reviews || ''}
                  onChange={handleEditInputChange}
                  min="0"
                  step="1"
                />
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                />
                {(editingItem.imagePreview || editingItem.image) && (
                  <div className="image-preview">
                    <img 
                      src={editingItem.imagePreview || editingItem.image} 
                      alt="Course preview" 
                    />
                  </div>
                )}
              </div>
              
              {editError && <div className="error-message">{editError}</div>}
              {editSuccess && <div className="success-message">{editSuccess}</div>}
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isEditDisabled}
                >
                  {editLoading ? 'Updating…' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Course</h3>
            <form onSubmit={createItem}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateInputChange}
                  placeholder="e.g. Advanced JavaScript"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateInputChange}
                  placeholder="Course description"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  name="price"
                  type="number"
                  value={createForm.price}
                  onChange={handleCreateInputChange}
                  placeholder="e.g. 99.99"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Instructor</label>
                <input
                  name="instructor"
                  value={createForm.instructor}
                  onChange={handleCreateInputChange}
                  placeholder="Instructor name"
                />
              </div>
              
              <div className="form-group">
                <label>Rating (0-5) *</label>
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={createForm.rating}
                  onChange={handleCreateInputChange}
                  placeholder="e.g. 4.5"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Reviews *</label>
                <input
                  name="reviews"
                  type="number"
                  min="0"
                  step="1"
                  value={createForm.reviews}
                  onChange={handleCreateInputChange}
                  placeholder="e.g. 24"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Image preview" />
                  </div>
                )}
              </div>
              
              {createError && <div className="error-message">{createError}</div>}
              {createSuccess && <div className="success-message">{createSuccess}</div>}
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isCreateDisabled}
                >
                  {createLoading ? 'Creating…' : 'Create Course'}
                </button>
                <button 
                  type="button" 
                  onClick={closeCreateModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}