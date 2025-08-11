'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Dragon Sword', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should raise attack by 1 stage when KOing a dragon type.', () => {
		battle = common.createBattle([[
			{ species: 'rescuecat', moves: ['dragonsword'] },
		], [
			{ species: 'babyd', moves: ['sleeptalk'] },
			{ species: 'darksage', moves: ['sleeptalk'] },
		]]);

		const rescuecat = battle.p1.active[0];
		const babyd = battle.p2.active[0];

		while (babyd.hp) {
			battle.makeChoices();
		}

		assert.fainted(babyd);
		assert.statStage(rescuecat, 'atk', 1);
	});
});
