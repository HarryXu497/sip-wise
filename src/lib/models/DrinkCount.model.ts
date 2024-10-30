type DrinkType = "water" | "juice" | "pop"; 

interface DrinkCount {
	type: DrinkType;
	count: number;
}

export type { DrinkType, DrinkCount };