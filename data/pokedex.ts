export const Pokedex: import('../sim/dex-species').SpeciesDataTable = {
	illusionm: {
		num: 1,
		name: "Illusion M",
		types: ["Dark"],
		gender: "M",
		baseStats: { hp: 50, atk: 60, def: 50, spa: 65, spd: 55, spe: 50 },
		abilities: {0: "Compound Eyes"},
		heightm: 0,
		weightkg: 17.8,
		color: "Purple",
		evos: ["D Magician"],
		eggGroups: [ "Monster", "Human-Like"],
	},
	dmagician: {
		num: 2,
		name: "D Magician",
		types: ["Dark"],
		gender: "M",
		baseStats: {hp: 70, atk: 70, def: 70, spa: 80, spd: 75, spe: 70},
		abilities: { 0: "Compound Eyes" },
		heightm: 0,
		weightkg: 80.01,
		color: "Purple",
		evos: ["Dark Sage", "Toon DM"],
		eggGroups: ["Monster", "Human-Like"],
	}
};