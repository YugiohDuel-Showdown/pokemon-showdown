/**
 * Miscellaneous Random Battle-related tests not associated with a particular generation.
 */

'use strict';

const assert = require('../assert');
const common = require('../common');
const { testTeam, validateLearnset } = require('./tools');
describe("New set format (slow)", () => {
	// formatInfo lists filenames and roles for each format
	const formatInfo = {
		"gen9randombattle": {
			filename: "gen9/sets",
			roles: ["Fast Attacker", "Setup Sweeper", "Wallbreaker", "Tera Blast user", "Bulky Attacker", "Bulky Setup", "Fast Bulky Setup", "Bulky Support", "Fast Support", "AV Pivot"],
		},
	};
	for (const format of Object.keys(formatInfo)) {
		const filename = formatInfo[format].filename;
		const setsJSON = require(`../../dist/data/random-battles/${filename}.json`);
		const dex = common.mod(common.getFormat({ formatid: format }).mod).dex; // verifies format exists
		const genNum = dex.gen;
		const rounds = 100;
		it(`${filename}.json should have valid set data`, () => {
			const validRoles = formatInfo[format].roles;
			for (const [id, sets] of Object.entries(setsJSON)) {
				const species = dex.species.get(id);
				assert(species.exists, `In ${format}, misspelled species ID: ${id}`);
				assert(Array.isArray(sets.sets));
				for (const set of sets.sets) {
					assert(validRoles.includes(set.role), `In ${format}, set for ${species.name} has invalid role: ${set.role}`);
					for (const move of set.movepool) {
						const dexMove = dex.moves.get(move);
						assert(dexMove.exists, `In ${format}, ${species.name} has invalid move: ${move}`);
						// Old gens have moves in id form, currently.
						if (genNum === 9) {
							assert.equal(move, dexMove.name, `In ${format}, ${species.name} has misformatted move: ${move}`);
						} else {
							assert(move === dexMove.id || move.startsWith('hiddenpower'), `In ${format}, ${species.name} has misformatted move: ${move}`);
						}
						assert(validateLearnset(dexMove, { species }, 'ubers', `gen${genNum}`), `In ${format}, ${species.name} can't learn ${move}`);
					}
					if (genNum >= 3) {
						assert(set.abilities, `In ${format}, ${set.abilities} has no abilities`);
						for (const ability of set.abilities) {
							const dexAbility = dex.abilities.get(ability);
							assert(dexAbility.exists, `In ${format}, ${species.name} has invalid ability: ${ability}`);
							// Mega/Primal Pokemon have abilities from their base formes
							const allowedAbilities = new Set(Object.values((species.battleOnly && !species.requiredAbility) ? dex.species.get(species.battleOnly).abilities : species.abilities));
							if (species.unreleasedHidden) allowedAbilities.delete(species.abilities.H);
							assert(allowedAbilities.has(ability), `In ${format}, ${species.name} can't have ${ability}`);
						}
					}
					if (genNum === 9) {
						assert(set.teraTypes, `In ${format}, ${species.name} has no Tera Types`);
						for (const type of set.teraTypes) {
							const dexType = dex.types.get(type);
							assert(dexType.exists, `In ${format}, ${species.name} has invalid Tera Type: ${type}`);
							assert.equal(type, dexType.name, `In ${format}, ${species.name} has misformatted Tera Type: ${type}`);
						}
					}
					if (set.preferredTypes) {
						for (const type of set.preferredTypes) {
							const dexType = dex.types.get(type);
							assert(dexType.exists, `In ${format}, ${species.name} has invalid Preferred Type: ${type}`);
							assert.equal(type, dexType.name, `In ${format}, ${species.name} has misformatted Preferred Type: ${type}`);
						}
					}
				}
			}
		});
		it('all Pokemon should have 4 moves, except for Ditto and Unown', () => {
			testTeam({ format, rounds }, team => {
				for (const pokemon of team) assert(pokemon.name === 'Ditto' || pokemon.name === 'Unown' || pokemon.moves.length === 4, `In ${format}, ${pokemon.name} can generate with ${pokemon.moves.length} moves`);
			});
		});
		it('all moves on all sets should exist and be obtainable', () => {
			const generator = Teams.getGenerator(format);
			for (const pokemon of Object.keys(setsJSON)) {
				const species = dex.species.get(pokemon);
				assert(species.exists, `In ${format}, Pokemon ${species} does not exist`);
				const sets = setsJSON[pokemon]["sets"];
				const types = species.types;
				for (const set of sets) {
					assert(set.movepool.every(m => dex.moves.get(m).exists), `In ${format}, for Pokemon ${species}, one of ${set.movepool} does not exist.`);
					const role = set.role;
					const moves = new Set(set.movepool.map(m => (m.startsWith('hiddenpower') ? m : dex.moves.get(m).id)));
					const abilities = set.abilities || [];
					const specialTypes = genNum === 9 ? set.teraTypes : set.preferredTypes;
					// Go through all possible teamDetails combinations, if necessary
					for (let j = 0; j < rounds; j++) {
						// In Gens 2-3, if a set has multiple preferred types, we enforce moves of all the types.
						const specialType = specialTypes ? (genNum > 3 ? specialTypes[j % specialTypes.length] : specialTypes.join()) : '';
						// Generate a moveset for each combination of relevant teamDetails. Spikes is relevant for Gen 2.
						for (let i = 0; i < 16; i++) {
							const rapidSpin = i % 2;
							const stealthRock = Math.floor(i / 2) % 2;
							const stickyWeb = Math.floor(i / 4) % 2;
							const spikes = Math.floor(i / 8) % 2;
							const screens = Math.floor(i / 2) % 2;
							const teamDetails = { rapidSpin, stealthRock, stickyWeb, spikes, screens };
							// randomMoveset() deletes moves from the movepool, so recreate it every time
							const movePool = set.movepool.map(m => (m.startsWith('hiddenpower') ? m : dex.moves.get(m).id));
							let moveSet;
							if (genNum === 9) {
								moveSet = generator.randomMoveset(types, abilities, teamDetails, species, false, format.includes('doubles'), movePool, specialType, role);
							} else {
								moveSet = generator.randomMoveset(types, abilities, teamDetails, species, false, movePool, specialType, role);
							}
							for (const move of moveSet) moves.delete(move);
							if (!moves.size) break;
						}
						if (!moves.size) break;
					}
					assert.false(moves.size, `In ${format}, the following moves on ${species.name} are unused: ${[...moves].join(', ')}`);
				}
			}
		});
	}
});
