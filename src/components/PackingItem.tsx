import { useState, useEffect } from 'react';
import './PackingItem.css';

// Shape of a packing item that this component will display
interface PackingItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// Props that this component accepts
interface ItemProps {
  item: PackingItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

// Component that displays a single packing item
export default function PackingItem({ 
  item, 
  onToggle, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast 
}: ItemProps) {
  // State for handling fade animations
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  // Start entrance animation when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Handle delete with fade-out animation
  const handleDelete = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onDelete(item.id);
    }, 200);
  };

  // Handle completion toggle with animation
  const handleToggle = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onToggle(item.id);
    }, 200);
  };

  return (
    <div className={`packing-item ${item.completed ? 'completed' : ''} ${isRemoving ? 'removing' : ''} ${isEntering ? 'entering' : ''}`}>
      <button onClick={handleToggle} className="item-toggle">
        {item.completed ? '✓' : '○'}
      </button>
      <div className="item-content">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <div className="item-actions">
        <div className="move-buttons">
          {!isFirst && onMoveUp && (
            <button onClick={onMoveUp} className="move-button">
              ↑
            </button>
          )}
          {!isLast && onMoveDown && (
            <button onClick={onMoveDown} className="move-button">
              ↓
            </button>
          )}
        </div>
        <button onClick={handleDelete} className="item-delete">
          ×
        </button>
      </div>
    </div>
  );
} 