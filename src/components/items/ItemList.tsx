import { IItem } from "@/app/interfaces/item";
import ItemCard from "./ItemCard";

interface ItemListProps {
  data: IItem[];
  clickable?: boolean;
}
export default function ItemList({ data, clickable }: ItemListProps) {
  return (
    <div className="flex flex-row flex-wrap gap-1 justify-center items-start">
      {data.map((item, key) => (
        <ItemCard key={key} item={item} clickable={clickable} />
      ))}
    </div>
  );
};