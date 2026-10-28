import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Maximize, BedDouble, Check, ArrowRight } from "lucide-react";
import { useData } from "../lib/data-context";
import { images } from "../lib/images";

export default function Rooms() {
  const { rooms, loading } = useData();

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.roomDeluxe})` }}
        />
        <div className="absolute inset-0 bg-night-900/50" />
        <div className="relative z-10 text-center px-6">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-3">Hébergement</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">
            Nos chambres
          </h1>
        </div>
      </section>

      {/* Rooms list */}
      <section className="py-20 px-6 bg-sand-50">
        <div className="max-w-6xl mx-auto space-y-16">
          {loading ? (
            <p className="text-center text-night-400">Chargement…</p>
          ) : (
            rooms
              .slice()
              .sort((a, b) => a.price_per_night - b.price_per_night)
              .map((room, index) => (
              <div
                key={room.id}
                id={room.slug}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center scroll-mt-24 ${
                  index % 2 === 1 ? "md:grid-flow-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                  <div className="relative h-80 md:h-96 overflow-hidden rounded-sm group">
                    <img
                      src={room.image_url}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                  <p className="section-subtitle">{room.beds}</p>
                  <h2 className="font-serif text-3xl md:text-4xl text-night-900 font-light mb-4">
                    {room.name}
                  </h2>
                  <p className="text-night-600 leading-relaxed mb-6">
                    {room.long_description}
                  </p>

                  <div className="flex flex-wrap gap-6 mb-6 text-sm text-night-600">
                    <span className="flex items-center gap-2">
                      <Users size={18} className="text-terracotta-500" />
                      {room.capacity} personnes
                    </span>
                    {room.size > 0 && (
                      <span className="flex items-center gap-2">
                        <Maximize size={18} className="text-terracotta-500" />
                        {room.size} m²
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <BedDouble size={18} className="text-terracotta-500" />
                      {room.beds}
                    </span>
                  </div>

                  <ul className="grid grid-cols-2 gap-2 mb-8">
                    {room.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2 text-sm text-night-600">
                        <Check size={16} className="text-oasis-500" />
                        {amenity}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t border-sand-200 pt-6">
                    <div>
                      <span className="font-serif text-3xl text-terracotta-600">
                        {room.price_per_night} MAD
                      </span>
                      <span className="text-night-400 text-sm"> / nuit</span>
                    </div>
                    {room.is_available ? (
                      <Link
                        to="/reserver"
                        state={{ roomId: room.id, roomName: room.name }}
                        className="btn-primary"
                      >
                        Réserver <ArrowRight size={16} className="ml-2" />
                      </Link>
                    ) : (
                      <span className="text-sm text-night-400 italic">Complète</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
