'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Royal Flush', () => {
	afterEach(() => {
		battle.destroy();
	});

	it("It should raise the Queen's Knight's Atk by 1.5", () => {
		battle = common.createBattle([[
			{ species: 'queensknight', ability: 'royalflush', moves: ['sleeptalk'] },
		], [
			{ species: 'queensknight', ability: 'owntempo', moves: ['sleeptalk'] },
		]]);
		const queensknightRF = battle.p1.active[0];
		const queensknight = battle.p2.active[0];
		assert.atLeast(queensknightRF.getStat('atk'), Math.floor(Math.round(queensknight.getStat('atk') * 1.5)));
	});

	it("It should raise the King's Knight's Def by 1.5", () => {
		battle = common.createBattle([[
			{ species: 'kingsknight', ability: 'royalflush', moves: ['sleeptalk'] },
		], [
			{ species: 'kingsknight', ability: 'owntempo', moves: ['sleeptalk'] },
		]]);

		const kingsknightRF = battle.p1.active[0];
		const kingsknight = battle.p2.active[0];

		assert.atLeast(kingsknightRF.getStat('def'), Math.floor(Math.round(kingsknight.getStat('def') * 1.5)));
	});

	it("It should raise the Jack's Knight's Spe by 1.5.", () => {
		battle = common.createBattle([[
			{ species: 'jacksknight', ability: 'royalflush', moves: ['sleeptalk'] },
		], [
			{ species: 'jacksknight', ability: 'owntempo', moves: ['sleeptalk'] },
		]]);

		const jacksknightRF = battle.p1.active[0];
		const jacksknight = battle.p2.active[0];

		assert.atLeast(jacksknightRF.getStat('spe'), Math.floor(Math.round(jacksknight.getStat('spe') * 1.5)));
	});
});
