// src/components/NeighborhoodCard.tsx

import Image from "next/image";
import Link from "next/link";

interface NeighborhoodCardProps {
  name: string;
  city: string;
  imageUrl: string;
  href: string;
}

export function NeighborhoodCard({
  name,
  city,
  imageUrl,
  href,
}: NeighborhoodCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="relative w-full h-80 overflow-hidden rounded-lg shadow-md">
        <Image
          src={imageUrl}
          alt={`Foto do bairro ${name}`}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-xl font-bold">{name}</h3>
          <p className="text-gray-200 text-sm">{city}</p>
        </div>
      </div>
    </Link>
  );
}
