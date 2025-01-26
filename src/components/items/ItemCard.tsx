export interface IItemCard {
    id: number,
    name: string,
    rarity: number,
    icon: string,
    icon_middle: string,
    icon_small: string,
}

export function ItemCard(card: IItemCard) {
    return (
        <div className="flex flex-col items-center justify-center">
            <h2>{card.name}</h2>
            <p>{card.rarity}</p>
        </div>
    )
}