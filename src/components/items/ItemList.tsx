import ItemCard, { IItemCard } from "./ItemCard";
import { useData } from "@/app/context/DataContext";

interface ItemListProps {
  data: IItemCard[];
  itemCount: number;
}[]

export default function ItemList({ data, itemCount }: ItemListProps) {
  const slicedData = data.slice(0, itemCount);
  console.log("Data", slicedData);

  return (
    <div className="flex flex-row flex-wrap space-x-4">
      {slicedData.map((item, key) => (
        <ItemCard key={key} item={item} />
      ))}
    </div>
  );
};