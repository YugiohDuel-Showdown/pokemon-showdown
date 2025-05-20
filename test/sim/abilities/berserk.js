'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Berserk', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should activate prior to healing from Sitrus Berry', () => {
		battle = common.createBattle([[
			{ species: 'berserkion', item: 'sitrusberry', ability: 'berserk', evs: { hp: 4 }, moves: ['sleeptalk'] },
		], [
			{ species: 'beaverw', ability: 'compoundeyes', moves: ['superfang'] },
		]]);

		battle.makeChoices();
		const berserkion = battle.p1.active[0];
		assert.statStage(berserkion, 'spa', 1);
		assert.equal(berserkion.hp, Math.floor(berserkion.maxhp / 2) + Math.floor(berserkion.maxhp / 4));
	});

	it('should not activate prior to healing from Sitrus Berry after a multi-hit move', () => {
		battle = common.createBattle([[
			{ species: 'berserkion', item: 'sitrusberry', ability: 'berserk', evs: { hp: 4 }, moves: ['sleeptalk'] },
		], [
			{ species: 'beaverw', ability: 'parentalbond', moves: ['seismictoss'] },
		]]);

		battle.makeChoices();
		const berserkion = battle.p1.active[0];
		assert.statStage(berserkion, 'spa', 0);
		assert.equal(berserkion.hp, berserkion.maxhp - 200 + Math.floor(berserkion.maxhp / 4));
	});
});
