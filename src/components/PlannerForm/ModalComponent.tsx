import useModal from "@/hooks/useModal";
import { ReactNode } from "react";

interface ModalComponentProps {
  show: boolean;
  children: ReactNode;
  onReturn?: () => void;
  onClose: () => void;
}
export const ModalComponent = ({ show, children, onClose, onReturn }: ModalComponentProps) => {
  useModal(show);

  if (!show) return null;

  return (
    <div
      className="z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500"
        >
          x
        </button>
        {onReturn && (
          <button
            onClick={onReturn}
            className="absolute top-2 left-2 text-xl text-gray-500"
          >
            &gt
          </button>
        )}
        {children}
      </div>
    </div>
  );
}