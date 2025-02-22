import ItemCard, { IItemCard } from "./ItemCard";

interface ItemListProps {
  data: IItemCard[];
  itemCount: number;
}

export default function ItemList({ data, itemCount }: ItemListProps) {
  const slicedData = itemCount > 0 ? data.slice(0, itemCount) : data;

  return (
    <div className="flex flex-row flex-wrap space-x-4">
      {slicedData.map((item, key) => (
        <ItemCard key={key} item={item} />
      ))}
    </div>
  );
};