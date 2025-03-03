import { ResonatorElement } from "@/constants/elements"
import { SearchIconFilterComponent } from "./SearchIconFilterComponent";

interface ElementComponentProps {
  element: ResonatorElement;
  highlight: boolean;
}
export const ElementComponent = ({ element, highlight }: ElementComponentProps) => {
  return (
    <SearchIconFilterComponent item={element} highlight={highlight} />
  )
}