const DRINK_TYPES = ['water', 'juice', 'pop'] as const;

type DrinkType = (typeof DRINK_TYPES)[number];

interface DrinkCount {
	type: DrinkType;
	count: number;
}

export { DRINK_TYPES, type DrinkType, type DrinkCount };
