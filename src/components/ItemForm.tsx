import { useState } from 'react';
import './ItemForm.css';

interface Category {
  id: string;
  name: string;
}

// Props that this component accepts
interface ItemFormProps {
  onAdd: (title: string, description: string, categoryId: string) => void;
  categories: Category[];
}

// Component for adding new items to pack
export default function ItemForm({ onAdd, categories }: ItemFormProps) {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return; // Don't add empty items
    onAdd(title.trim(), description.trim(), categoryId);
    setTitle(''); // Clear inputs after adding
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Vad ska packas?"
          className="item-input"
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lägg till en beskrivning (valfritt)"
          className="item-input"
          rows={3}
        />
      </div>
      <div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="category-select"
          required
        >
          <option value="">Välj kategori</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="item-submit">
        Lägg till
      </button>
    </form>
  );
} 