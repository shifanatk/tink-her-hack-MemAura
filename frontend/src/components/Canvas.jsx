import React, { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import PinWidget from './PinWidget';

/**
 * Canvas is now responsible for:
 * - Loading the current user's canvas items from the backend (MongoDB)
 * - Letting the user drag items around
 * - Persisting position updates back to the backend
 */
const Canvas = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.email) {
      setItems([]);
      setLoading(false);
      return;
    }

    console.log('Canvas: loading items for user', user.email);

    fetch('http://localhost:8080/api/canvas', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load canvas items: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setItems(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Canvas: error loading items', err);
        setError('Could not load your scrapbook items.');
        setLoading(false);
      });
  }, [user]);

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const id = active.id;

    setItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.id.toString() === id.toString()) {
          const newItem = {
            ...item,
            positionX: item.positionX + delta.x,
            positionY: item.positionY + delta.y,
          };

          // Persist this single item update
          fetch('http://localhost:8080/api/canvas', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
          }).catch((err) => {
            console.error('Canvas: failed to save item position', err);
          });

          return newItem;
        }
        return item;
      });

      return updated;
    });
  };

  if (loading) {
    return <div className="canvas-loading">Loading your scrapbook…</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="canvas-area">
        {error && <div className="canvas-error">{error}</div>}
        {items.map((item) => (
          <PinWidget key={item.id} item={item} />
        ))}
        {items.length === 0 && !error && (
          <div className="canvas-empty-hint">
            Your scrapbook is empty. Start pinning memories to see them here.
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default Canvas;