'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const Dex = require('./../../../dist/sim/dex').Dex;

let battle;

describe('Zombie World', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change the current terrain to Zombie World for five turns', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['zombieworld', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
			assert(battle.field.isTerrain('zombieworld'));
		}
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(battle.field.isTerrain(''));
	});

	it('should turn all monsters to ghost types on field', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['zombieworld', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].getTypes().join(), 'Ghost');
		assert.equal(battle.p2.active[0].getTypes().join(), 'Ghost');
	});

	it('should turn all monsters back to normal after zombieworld ends', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['zombieworld', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
			assert(battle.field.isTerrain('zombieworld'));
		}
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(battle.field.isTerrain(''));
		assert.equal(battle.p1.active[0].getTypes().join(), 'Psychic');
		assert.equal(battle.p2.active[0].getTypes().join(), 'Normal');
	});

	it('should increase the base power of Ghost-type attacks used by grounded Monsters', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciangirl', moves: ['zombieworld', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const move = Dex.moves.get('shadowball');
		const dmgirl = battle.p1.active[0];
		const twizard = battle.p2.active[0];
		const basePower = battle.runEvent('BasePower', dmgirl, twizard, move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 1.1));
	});
});
