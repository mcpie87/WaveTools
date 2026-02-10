'use client';
// import ItemList from "@/components/items/ItemList";
// import { useData } from "@/app/context/DataContext";
// import PlannerCardList from "./PlannerCardList";

// import Modal from "./modal";

export default function PlannerContainer() {
  // const { data, loading, error } = useData();

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [submittedData, setSubmittedData] = useState("");

  // function handleOpen() {
  //   setIsModalOpen(true);
  // }

  // function handleClose() {
  //   setIsModalOpen(false);
  // }

  // function handleSubmit(data: string) {
  //   setSubmittedData(data);
  // }

  // return (
  //   <div className="flex flex-col items-center justify-center h-screen gap-4">
  //     <button onClick={handleOpen} className="px-6 py-3 bg-blue-500 text-white rounded">
  //       Open Modal
  //     </button>
  //     {submittedData && <p className="text-lg">Submitted: {submittedData}</p>}
  //     <Modal isOpen={isModalOpen} onClose={handleClose} onSubmit={handleSubmit} />
  //   </div>
  // );
  return (
    <div>
      <div className="p-4">
        <h1 className="text-xl font-semibold">
          Your characters
        </h1>
      </div>
    </div>
  )
}