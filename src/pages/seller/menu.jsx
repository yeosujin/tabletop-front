import React, { useState } from 'react';

const MenuItem = ({ item, onSave, onDelete, isNew }) => {
  const [name, setName] = useState(item.name || '');
  const [price, setPrice] = useState(item.price || '');
  const [description, setDescription] = useState(item.description || '');
  const [image, setImage] = useState(item.image || null);

  const handleSave = () => {
    onSave({ id: item.id, name, price, description, image });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div>
        <div>
          {image ? (
            <img src={image} alt={name} style={{maxWidth: '100%', height: 'auto'}} />
          ) : (
            <div>No Image Uploaded</div>
          )}
          <input type="file" onChange={handleImageUpload} accept="image/*" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Food Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <textarea
            placeholder="Food Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
        {!isNew && (
          <button onClick={() => onDelete(item.id)}>Delete</button>
        )}
      </div>
    </div>
  );
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  const addMenuItem = () => {
    setMenuItems([...menuItems, { id: Date.now() }]);
  };

  const saveMenuItem = (item) => {
    setMenuItems(menuItems.map((i) => (i.id === item.id ? item : i)));
  };

  const deleteMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1>자리부터JAVA</h1>
      <div>
        <h2>Menu</h2>
        <div>
          <button>Profile</button>
          <button>Log-out</button>
        </div>
      </div>
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          onSave={saveMenuItem}
          onDelete={deleteMenuItem}
        />
      ))}
      <button onClick={addMenuItem}>+ Add Menu Item</button>
    </div>
  );
};

export default Menu;