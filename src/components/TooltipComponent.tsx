import { ReactNode, useState } from "react";

interface TooltipComponentProps {
  children: ReactNode;
  content: ReactNode;
}
export const TooltipComponent = ({ children, content }: TooltipComponentProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        // <div className="absolute bottom-full mb-2 w-max px-3 py-1 text-white text-sm rounded-lg bg-gray-800 opacity-0 transition-opacity duration-300">
        <div className={`absolute mb-2 w-max px-3 py-1 text-sm border bg-base-200 transition-opacity duration-1000
          ${visible ? "opacity-100" : "opacity-0 hidden"}
          z-50 left-1/2 transform -translate-x-1/2
        `}>
          {content}
        </div>
      )}
    </div>
  )
}