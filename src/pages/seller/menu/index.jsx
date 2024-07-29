// Menu.jsx
import React, { useState } from 'react';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setNewItem(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send a POST request to your Spring Boot backend
    setMenuItems(prev => [...prev, newItem]);
    setNewItem({ name: '', price: '', description: '', image: null });
    setShowForm(false);
  };

  const handleDelete = (index) => {
    // Here you would typically send a DELETE request to your Spring Boot backend
    setMenuItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.container}>
      <h2>Menu</h2>
      <button onClick={() => setShowForm(true)} style={styles.addButton}>+ Add Menu</button>
      
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="file" onChange={handleImageUpload} style={styles.input} />
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Food name"
            style={styles.input}
          />
          <input
            type="text"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            placeholder="Food price"
            style={styles.input}
          />
          <textarea
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            placeholder="Food description"
            style={styles.textarea}
          />
          <button type="submit" style={styles.saveButton}>Save</button>
        </form>
      )}

      <div style={styles.menuList}>
        {menuItems.map((item, index) => (
          <div key={index} style={styles.menuItem}>
            {item.image && <img src={URL.createObjectURL(item.image)} alt={item.name} style={styles.menuImage} />}
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <p>{item.description}</p>
            <button onClick={() => handleDelete(index)} style={styles.deleteButton}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '2rem',
  },
  input: {
    margin: '0.5rem 0',
    padding: '0.5rem',
  },
  textarea: {
    margin: '0.5rem 0',
    padding: '0.5rem',
    minHeight: '100px',
  },
  saveButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  menuList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  menuItem: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '1rem',
  },
  menuImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '1rem',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Menu;