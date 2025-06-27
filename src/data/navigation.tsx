// Navigation items for the sidebar
import {
  AlertCircle,
  Compass,
  Home,
  Info,
  MessageCircle,
  Paintbrush,
  Settings,
  Sparkles,
} from "lucide-react";

import type { SidebarItem } from "../types";


export const sidebarItems: SidebarItem[] = [
  { key: "home", label: "Home", icon: <Home size={18} /> },
  { key: "deinweg", label: "Mein Kompass", icon: <Compass size={18} /> },
  {
    key: "skills",
    label: "Skills & Achtsamkeit",
    icon: <Sparkles size={18} />,
  },
  { key: "designs", label: "Designs", icon: <Paintbrush size={18} /> },
  { key: "notfall", label: "Notfall", icon: <AlertCircle size={18} /> },
  { key: "guide", label: "Guide", icon: <Info size={18} /> },
  { key: "chat", label: "Chatbot", icon: <MessageCircle size={18} /> },
  {
    key: "quickedit",
    label: "Homescreen anpassen",
    icon: <Settings size={18} />,
  },
];

export default sidebarItems;
