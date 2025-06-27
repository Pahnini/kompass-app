export type BackgroundName = "Clean" | "Grün Verlauf";

export type BackgroundOptions = {
  name: BackgroundName;
  url: string;
};

export const backgrounds: BackgroundOptions[] = [
  { name: "Clean", url: "" },
  {
    name: "Grün Verlauf",
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a01b2?auto=format&fit=crop&w=800&q=60",
  },
];

export default backgrounds;
