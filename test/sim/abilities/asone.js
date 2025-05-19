'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('As One', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should work if the user is Transformed', () => {
		battle = common.createBattle([[
			{ species: 'illusionm', ability: 'imposter', moves: ['transform'] },
		], [
			{ species: 'alligatorsdgn', ability: 'asonespectrier', item: 'cheriberry', moves: ['glare', 'sleeptalk', 'thunderbolt'] },
			{ species: 'dupefrog', moves: ['sleeptalk'] },
		]]);

		const illusionm = battle.p1.active[0];
		const alligatorsdgn = battle.p2.active[0];
		battle.makeChoices('move glare', 'move sleeptalk');
		assert.equal(alligatorsdgn.status, 'par', 'AlligatorS DGN should not haven eaten its Berry, being affected by Illusion M-AlligatorS DGN\'s Unnerve');
		while (alligatorsdgn.hp !== 0) {
			battle.makeChoices('move thunderbolt', 'move sleeptalk');
		}
		assert.statStage(illusionm, 'spa', 1);
	});
});
