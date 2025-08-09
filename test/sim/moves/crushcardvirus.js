'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Crush Card Virus', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should damage the user to 1 hp', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['crushcardvirus'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		const dmgirl = battle.p1.active[0];
		const hpBefore = dmgirl.hp;
		battle.makeChoices('move crushcardvirus', 'move sleeptalk');
		assert.equal(dmgirl.hp, 1);
		assert.notEqual(hpBefore, dmgirl.hp);
	});

	it('should poison the target and their team', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['crushcardvirus'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
			{ species: 'darkmagician', moves: ['sleeptalk'] },
			{ species: 'wingedkrb', moves: ['sleeptalk'] },
		]]);

		const dmgirl = battle.p1.active[0];
		const timewizard = battle.p2.active[0];
		const darkmagician = battle.p2.pokemon[1];
		const wingedkrb = battle.p2.pokemon[2];

		battle.makeChoices('move crushcardvirus', 'move sleeptalk');

		assert.equal(timewizard.status, 'tox');
		assert.equal(darkmagician.status, 'tox');
		assert.equal(wingedkrb.status, 'tox');

		assert.equal(dmgirl.hp, 1);
	});
});
