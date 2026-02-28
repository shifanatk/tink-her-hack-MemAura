import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const PinWidget = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id.toString(),
  });

  const style = {
    position: 'absolute',
    left: `${item.positionX}px`,
    top: `${item.positionY}px`,
    zIndex: item.zIndex,
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${item.rotationAngle}deg)` 
      : `rotate(${item.rotationAngle}deg)`,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className="pin-widget"
    >
      <img src={item.imageUrl} alt="Scrapbook memory" draggable="false" />
    </div>
  );
};

export default PinWidget;