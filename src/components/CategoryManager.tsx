import { useState } from 'react';
import './CategoryManager.css';

interface Category {
  id: string;
  name: string;
  order: number;
}

interface PackingItem {
  id: number;
  categoryId: string;
}

interface Props {
  categories: Category[];
  items: PackingItem[];
  onDeleteCategory: (id: string) => void;
  onGoBack: () => void;
}

export default function CategoryManager({ categories, items, onDeleteCategory, onGoBack }: Props) {
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setIsTransitioning(true);
      setTimeout(() => {
        onDeleteCategory(categoryToDelete);
        setCategoryToDelete(null);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
  };

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <button onClick={onGoBack} className="back-button">
          ← Tillbaka
        </button>
        <h2>Hantera Kategorier</h2>
      </div>

      <div className="categories-list">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={`category-item ${isTransitioning && categoryToDelete === category.id ? 'exiting' : ''}`}
          >
            <div className="category-info">
              <h3>{category.name}</h3>
              <span className="item-count">
                {items.filter(item => item.categoryId === category.id).length} saker
              </span>
            </div>
            <button
              onClick={() => handleDeleteClick(category.id)}
              className="delete-button"
              disabled={categoryToDelete !== null}
            >
              Ta bort
            </button>
          </div>
        ))}
      </div>

      {categoryToDelete && (
        <div className="delete-confirmation">
          <p>
            Är du säker på att du vill ta bort denna kategori?
            Alla saker i kategorin kommer också att tas bort.
          </p>
          <div className="confirmation-buttons">
            <button onClick={handleConfirmDelete} className="confirm-button">
              Ja, ta bort
            </button>
            <button onClick={handleCancelDelete} className="cancel-button">
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 