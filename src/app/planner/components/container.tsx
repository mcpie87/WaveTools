// // import ItemList from "@/components/items/ItemList";
// import { useData } from "@/app/context/DataContext";
// import PlannerCardList from "./PlannerCardList";

// export default function PlannerContainer() {
//   const { data, loading, error } = useData();

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="p-4">
//         <h1 className="text-xl font-semibold">
//           Your characters
//         </h1>
//       </div>
//       <div>
//         <PlannerCardList data={data.resonators} />
//       </div>
//     </div>
//   )
// }