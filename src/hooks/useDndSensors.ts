// components/DragAndDrop/useDndSensors.ts
import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

export const useDndSensors = () =>
  useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Verhindert versehentliches Ziehen
        tolerance: 5,
      },
    })
  );
