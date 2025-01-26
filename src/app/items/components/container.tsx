import ItemList from "@/components/items/ItemList";
import { useData } from "@/app/context/DataContext";

export default function ItemsContainer() {
  const { data, loading, error } = useData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ItemList data={data.items} itemCount={5} />
  )
}