'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Cheek Pouch', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should restore 1/3 HP to the user after eating a Berry', () => {
		battle = common.createBattle([[
			{ species: 'rescuerabbit', item: 'lumberry', ability: 'cheekpouch', moves: ['sleeptalk'] },
		], [
			{ species: 'rescuecat', moves: ['nuzzle'] },
		]]);

		const resucerabbit = battle.p1.active[0];
		battle.makeChoices();
		assert.fullHP(resucerabbit);
	});

	it('should not activate if the user was at full HP', () => {
		battle = common.createBattle([[
			{ species: 'rescuerabbit', item: 'lumberry', ability: 'cheekpouch', moves: ['sleeptalk'] },
		], [
			{ species: 'rescuecat', moves: ['glare'] },
		]]);
		battle.makeChoices();
		assert(battle.log.every(line => !line.startsWith('|-heal')));
	});
});