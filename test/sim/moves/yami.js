'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const Dex = require('./../../../dist/sim/dex').Dex;

let battle;

describe('Yami', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change the current terrain to Yami for five turns', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['yami', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
			assert(battle.field.isTerrain('yami'));
		}
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(battle.field.isTerrain(''));
	});

	it('should increase the base power of Dark-type attacks used by grounded Monsters', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['yami'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const move = Dex.moves.get('darkpulse');
		const dmgirl = battle.p1.active[0];
		const twizard = battle.p2.active[0];
		const basePower = battle.runEvent('BasePower', dmgirl, twizard, move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 1.3));
	});

	it('should halve the base power of Fairy-type attacks against grounded targets', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['yami'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const move = Dex.moves.get('dazzlinggleam');
		const dmgirl = battle.p1.active[0];
		const twizard = battle.p2.active[0];
		const basePower = battle.runEvent('BasePower', dmgirl, twizard, move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 0.5));
	});
});
