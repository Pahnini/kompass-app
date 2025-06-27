import { Key, ReactNode } from "react";

export type BackgroundName = "Clean" | "Grün Verlauf";

export type BackgroundOptions = {
  id: Key | null | undefined;
  label: ReactNode;
  color: string | undefined;
  name: BackgroundName;
  url: string;
};

export const backgrounds: BackgroundOptions[] = [
  {
    name: "Clean", url: "",
    id: undefined,
    label: undefined,
    color: undefined
  },
  {
    name: "Grün Verlauf",
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a01b2?auto=format&fit=crop&w=800&q=60",
    id: undefined,
    label: undefined,
    color: undefined
  },
];

export default backgrounds;
