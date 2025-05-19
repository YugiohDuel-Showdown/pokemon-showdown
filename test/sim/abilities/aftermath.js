'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Aftermath', () => {
	afterEach(() => {
		battle.destroy();
	});

	it("should hurt attackers by 1/4 their max HP when this Monster is KOed by a contact move", () => {
		battle = common.createBattle([[
			{ species: 'exodia', moves: ['lunge'] },
		], [
			{ species: 'agido', ability: 'aftermath', moves: ['sleeptalk'] },
		]]);
		while (battle.p2.active[0].hp !== 0) {
			battle.makeChoices();
		}
		const attacker = battle.p1.active[0];
		assert.equal(attacker.hp, attacker.maxhp - Math.floor(attacker.maxhp / 4));
	});
});
