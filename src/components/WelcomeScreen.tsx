import React, { useState, useEffect } from "react";
import compassImg from "../assets/kompass-welcome.png";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { loadData, saveData } from "../services/storageService";
import "./WelcomeScreen.css";

interface WelcomeScreenProps {
  onContinue: () => void;
}

interface FeatureItem {
  id: string;
  icon: string;
  label: string;
}


const defaultItems: FeatureItem[] = [
  { id: "skills", icon: "🎯", label: "Skills" },
  { id: "tagebuch", icon: "📝", label: "Tagebuch" },
  { id: "chatbot", icon: "🤖", label: "Chatbot" },
  { id: "notfall", icon: "🚨", label: "Notfall" },
];

export default function WelcomeScreen({
  onContinue,
}: WelcomeScreenProps): React.ReactElement {
  const [items, setItems] = useState<FeatureItem[]>(defaultItems);

  const sensors = useSensors(useSensor(PointerSensor));

  // Reihenfolge beim Laden wiederherstellen
  useEffect(() => {
    const data = loadData();
    if (data?.buttonOrder) {
      const ordered = data.buttonOrder
        .map((id) => defaultItems.find((item) => item.id === id))
        .filter(Boolean) as FeatureItem[];
      setItems(ordered);
    }
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Neue Reihenfolge speichern
      const newOrder = newItems.map((i) => i.id);
      const existingData = loadData() || {};
      saveData({ ...existingData, buttonOrder: newOrder });
    }
  };

  return (
    <div
      className="welcome-screen"
      style={{
        backgroundImage: `url(${compassImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="welcome-content"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "1.5rem",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: "1rem",
            color: "#2f4f4f",
          }}
        >
          Schön, dass du wieder da bist
        </h1>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="feature-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                margin: "2rem 0",
              }}
            >
              {items.map((item) => (
                <SortableFeatureCard
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          className="continue-btn"
          onClick={onContinue}
          style={{
            backgroundColor: "#2f4f4f",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          Los geht's →
        </button>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          Immer für dich da – Skills, Pläne & Hilfe bei Krisen
        </p>
      </div>
    </div>
  );
}

function SortableFeatureCard({
  id,
  icon,
  label,
}: {
  id: string;
  icon: string;
  label: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "#f0f4f5",
    borderRadius: "1rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    color: "#2f4f4f",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
