import { Link } from "react-router-dom";
import { ArrowRight, Bed, Mountain, UtensilsCrossed, Calendar } from "lucide-react";
import { useData } from "../lib/data-context";
import { images } from "../lib/images";

export default function Home() {
  const { rooms, loading } = useData();
  const featuredRooms = rooms.filter((r) => r.featured && r.is_available).slice(0, 3);
