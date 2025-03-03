import { IItem } from "@/app/interfaces/item";
import ItemCard from "./ItemCard";

interface ItemListProps {
  data: IItem[];
}
export default function ItemList({ data }: ItemListProps) {
  return (
    <div className="flex flex-row flex-wrap space-x-4">
      {data.map((item, key) => (
        <ItemCard key={key} item={item} />
      ))}
    </div>
  );
};