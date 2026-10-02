import landCruiser from "@/assets/car-land-cruiser.jpg";
import lexus from "@/assets/car-lexus-rx.jpg";
import mercedes from "@/assets/car-mercedes-e.jpg";
import bmw from "@/assets/car-bmw-5.jpg";
import rangeRover from "@/assets/car-range-rover.jpg";
import hyundai from "@/assets/car-hyundai.jpg";
import globalImage from "@/assets/awa-global.jpg";
import partsImage from "@/assets/awa-parts-category.jpg";
import { importedVehicles } from "@/lib/alibaba-import";

export type Vehicle = {
  slug: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  fuel: string;
  transmission: string;
  driveType?: string;
  price: string;
  mileage: string;
  engine: string;
  color: string;
  availability: string;
  image: string;
  description: string;
  has_360?: boolean;
  images?: string[];
  category?: string;
  source?: string;
};
export function getVehicleFallbackImage(category?: string) {
  if (category === "Truck") return globalImage;
  if (category === "Sedan") return mercedes;
  return category === "SUV" ? landCruiser : lexus;
}
const localVehicles: Vehicle[] = [
  {
    slug: "toyota-land-cruiser",
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2024,
    condition: "New",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "GHS 241,257.94-265,384.94",
    mileage: "Delivery mileage",
    engine: "3.5L V6",
    color: "Pearl White",
    availability: "Available to source",
    image: landCruiser,
    description:
      "A capable full-size SUV configured for premium comfort, long-distance travel and demanding road conditions.",
    source: "Alibaba reference pricing",
  },
  {
    slug: "lexus-rx-350",
    brand: "Lexus",
    model: "RX 350",
    year: 2023,
    condition: "New",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "GHS 319,682.75",
    mileage: "Delivery mileage",
    engine: "2.4L Turbo",
    color: "White",
    availability: "Available to source",
    image: lexus,
    description:
      "A refined luxury crossover combining a quiet cabin, modern technology and everyday versatility.",
    source: "Alibaba reference pricing",
  },
  {
    slug: "mercedes-benz-e-class",
    brand: "Mercedes-Benz",
    model: "E-Class",
    year: 2023,
    condition: "Pre-owned",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "GHS 319,682.75",
    mileage: "On request",
    engine: "2.0L Turbo",
    color: "Obsidian Black",
    availability: "Subject to confirmation",
    image: mercedes,
    description:
      "An executive sedan with premium appointments, composed road manners and a sophisticated cabin.",
    source: "Alibaba reference pricing",
  },
  {
    slug: "bmw-5-series",
    brand: "BMW",
    model: "5 Series",
    year: 2023,
    condition: "Pre-owned",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "GHS 275,735.42",
    mileage: "On request",
    engine: "2.0L Turbo",
    color: "Metallic Blue",
    availability: "Subject to confirmation",
    image: bmw,
    description:
      "A dynamic executive sedan balancing performance, comfort and contemporary driver technology.",
    source: "Alibaba reference pricing",
  },
  {
    slug: "range-rover-sport",
    brand: "Range Rover",
    model: "Sport",
    year: 2022,
    condition: "Pre-owned",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "GHS 373,727.23-396,768.52",
    mileage: "On request",
    engine: "3.0L",
    color: "Graphite",
    availability: "Available to source",
    image: rangeRover,
    description:
      "A premium performance SUV with commanding presence, refined comfort and all-road capability.",
    source: "Alibaba reference pricing",
  },
  {
    slug: "hyundai-santa-fe",
    brand: "Hyundai",
    model: "Santa Fe",
    year: 2024,
    condition: "New",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "GHS 194,222.35",
    mileage: "Delivery mileage",
    engine: "2.5L",
    color: "Silver",
    availability: "Available to source",
    image: hyundai,
    description: "A practical modern SUV with generous interior space and family-focused comfort.",
    source: "Alibaba reference pricing",
  },
];
export const vehicles: Vehicle[] = [...localVehicles, ...importedVehicles];

// Kept for the planned future spare-parts upgrade; no public route or navigation links use this data.
export type Part = {
  slug: string;
  name: string;
  compatible: string;
  category: string;
  availability: string;
  price: string;
  image: string;
  description: string;
};
export const parts: Part[] = [
  {
    slug: "premium-brake-disc-kit",
    name: "Premium Brake Disc Kit",
    compatible: "Multiple makes and models",
    category: "Brake Parts",
    availability: "Available on request",
    price: "Request Price",
    image: partsImage,
    description: "Brake disc and pad solutions sourced to match your vehicle specification.",
  },
  {
    slug: "engine-piston-set",
    name: "Engine Piston Set",
    compatible: "Matched by engine code",
    category: "Engine Parts",
    availability: "Available on request",
    price: "Request Price",
    image: partsImage,
    description: "Precision engine components sourced against model, year and engine details.",
  },
  {
    slug: "suspension-strut-assembly",
    name: "Suspension Strut Assembly",
    compatible: "SUVs and sedans",
    category: "Suspension",
    availability: "Available on request",
    price: "Request Price",
    image: partsImage,
    description: "Complete suspension assemblies for a broad selection of passenger vehicles.",
  },
  {
    slug: "cabin-air-filter",
    name: "Cabin Air Filter",
    compatible: "Multiple makes and models",
    category: "Filters",
    availability: "Available on request",
    price: "Request Price",
    image: partsImage,
    description: "Quality filtration components selected for compatible vehicle applications.",
  },
];
export const partCategories = [
  "Engine Parts",
  "Brake Parts",
  "Suspension",
  "Electrical Parts",
  "Body Parts",
  "Transmission Parts",
  "Filters",
  "Lighting",
  "Accessories",
];
