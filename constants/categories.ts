import { ShoppingBag, Utensils, Car, Home, Film, Plane, Lightbulb, Stethoscope, GraduationCap, Package } from 'lucide-react-native';
import { categoryColors } from './colors';

export type CategoryType = {
  id: string;
  name: string;
  icon: any;
  color: string;
};

export const categories: CategoryType[] = [
  {
    id: 'food',
    name: 'Food & Drinks',
    icon: Utensils,
    color: categoryColors.food,
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: Car,
    color: categoryColors.transportation,
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: Home,
    color: categoryColors.housing,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Film,
    color: categoryColors.entertainment,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingBag,
    color: categoryColors.shopping,
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: Lightbulb,
    color: categoryColors.utilities,
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: Plane,
    color: categoryColors.travel,
  },
  {
    id: 'health',
    name: 'Health',
    icon: Stethoscope,
    color: categoryColors.health,
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: categoryColors.education,
  },
  {
    id: 'other',
    name: 'Other',
    icon: Package,
    color: categoryColors.other,
  },
];

export const getCategoryById = (id: string): CategoryType => {
  return categories.find(category => category.id === id) || categories[categories.length - 1];
};