'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Honst Power', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should increase the user\'s Sp. Atk by 2', () => {
		battle = common.createBattle([[
			{ species: 'rescuecat', ability: 'honestpower', moves: ['sleeptalk'] },
		], [
			{ species: 'rescuecat', moves: ['sleeptalk'] },
		]]);
		const rescuecatHP = battle.p1.active[0];
		const rescuecat = battle.p2.active[0];
		assert.hasAbility(rescuecatHP, 'honestpower');
		assert.atLeast(rescuecatHP.getStat('spa'), Math.floor(Math.round(rescuecat.getStat('spa') * 2)));
	});
});
