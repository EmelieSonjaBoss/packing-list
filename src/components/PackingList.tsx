import { useState, useEffect } from 'react';
import ItemComponent from './PackingItem';
import ItemForm from './ItemForm';
import CategoryManager from './CategoryManager';
import './PackingList.css';

// Type definitions
interface PackingItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  order: number;
  isDefault?: boolean;
}

/**
 * Main component that handles the packing list functionality.
 * Manages items, categories, and their persistence in localStorage.
 */
export default function PackingList() {
  // Initialize state with data from localStorage
  const [items, setItems] = useState<PackingItem[]>(() => {
    const savedItems = localStorage.getItem('packingItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    const defaultCategories = [
      { id: 'toiletries', name: 'Hygienartiklar', order: 0 },
      { id: 'clothes', name: 'Kläder', order: 1 },
      { id: 'electronics', name: 'Elektronik', order: 2 },
      { id: 'documents', name: 'Dokument', order: 3 },
      { id: 'other', name: 'Övrigt', order: 4 }
    ];
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  const [showCompleted, setShowCompleted] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewTransition, setViewTransition] = useState('');

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('packingItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Handle view transitions
  const handleViewTransition = (newView: boolean) => {
    setIsTransitioning(true);
    setViewTransition('view-exit');
    
    setTimeout(() => {
      setShowCategoryManager(newView);
      setViewTransition('view-enter');
      
      setTimeout(() => {
        setViewTransition('');
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  // Handle filter transitions
  const handleFilterChange = () => {
    setIsTransitioning(true);
    setViewTransition('view-exit');
    
    setTimeout(() => {
      setShowCompleted(!showCompleted);
      setViewTransition('view-enter');
      
      setTimeout(() => {
        setViewTransition('');
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  // Item management handlers
  const handleToggle = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Moves an item up or down within its category
  const moveItem = (id: number, direction: 'up' | 'down') => {
    const itemToMove = items.find(item => item.id === id);
    if (!itemToMove) return;

    // Get items in the same category and with the same completed status
    const categoryItems = items.filter(item => 
      item.categoryId === itemToMove.categoryId && 
      item.completed === itemToMove.completed
    );
    
    const index = categoryItems.findIndex(item => item.id === id);
    // Don't move if we're at the top/bottom of the category
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === categoryItems.length - 1)
    ) {
      return;
    }

    // Find the indices in the main items array
    const currentIndex = items.findIndex(item => item.id === id);
    const swapWithId = categoryItems[direction === 'up' ? index - 1 : index + 1].id;
    const swapIndex = items.findIndex(item => item.id === swapWithId);

    // Create new array and swap items
    const newItems = [...items];
    [newItems[currentIndex], newItems[swapIndex]] = [newItems[swapIndex], newItems[currentIndex]];
    setItems(newItems);
  };

  const handleAdd = (title: string, description: string, categoryId: string) => {
    const newItem: PackingItem = {
      id: Date.now(),
      title,
      description,
      completed: false,
      categoryId
    };
    setItems([...items, newItem]);
  };

  // Category management handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    const categoryId = newCategory.toLowerCase().replace(/\s+/g, '-');
    const newCategoryItem: Category = {
      id: categoryId,
      name: newCategory.trim(),
      order: categories.length
    };
    
    setCategories([...categories, newCategoryItem]);
    setNewCategory('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setItems(items.filter(item => item.categoryId !== categoryId));
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  // Sort categories by their defined order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="packing-list">
      <div className={`view-transition ${viewTransition}`}>
        {showCategoryManager ? (
          <CategoryManager
            categories={categories}
            items={items}
            onDeleteCategory={handleDeleteCategory}
            onGoBack={() => handleViewTransition(false)}
          />
        ) : (
          <>
            <h1>Packlista</h1>
            
            <ItemForm onAdd={handleAdd} categories={categories} />

            {/* Category management section */}
            <div className="category-controls">
              <form onSubmit={handleAddCategory} className="category-form">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Lägg till ny kategori"
                  className="category-input"
                />
                <button type="submit" className="category-submit">Lägg till</button>
              </form>
              <button
                onClick={() => handleViewTransition(true)}
                className="manage-categories-button"
                disabled={isTransitioning}
              >
                Hantera kategorier
              </button>
            </div>
            
            {/* Filters and item count */}
            <div className="item-filters">
              <button 
                onClick={handleFilterChange}
                className="filter-button"
                disabled={isTransitioning}
              >
                Visa {showCompleted ? 'opackade' : 'packade'} saker
              </button>
              <div className="item-count">
                {showCompleted 
                  ? `${items.filter(item => item.completed).length} packade saker`
                  : `${items.filter(item => !item.completed).length} opackade saker`}
              </div>
            </div>

            {/* Items grouped by category */}
            {sortedCategories.map((category) => {
              const categoryItems = items.filter(item => 
                item.categoryId === category.id && 
                item.completed === showCompleted
              );

              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id} className={`category-section ${viewTransition}`}>
                  <div className="category-header">
                    <h2>{category.name}</h2>
                  </div>
                  <ul className="item-list">
                    {categoryItems.map((item, index) => (
                      <li key={item.id} className="item-wrapper">
                        <div className="sort-buttons">
                          <button
                            onClick={() => moveItem(item.id, 'up')}
                            disabled={index === 0}
                            className="sort-button"
                            title="Flytta upp"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveItem(item.id, 'down')}
                            disabled={index === categoryItems.length - 1}
                            className="sort-button"
                            title="Flytta ner"
                          >
                            ↓
                          </button>
                        </div>
                        <ItemComponent
                          item={item}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            
            {/* Empty state message */}
            {items.filter(item => showCompleted ? item.completed : !item.completed).length === 0 && (
              <p className={`empty-message ${viewTransition}`}>
                {showCompleted 
                  ? "Inga packade saker än!"
                  : "Inga saker att packa! Lägg till några saker i din packlista."}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
} 