import ItemCard, { IItemCard } from "./ItemCard";

interface ItemListProps {
  data: IItemCard[];
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