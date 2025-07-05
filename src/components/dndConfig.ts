// components/DragAndDrop/dndConfig.ts
import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export const sensors = () =>
  useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,      // Verhindert versehentliches Ziehen
        tolerance: 5,
      },
    })
  );
