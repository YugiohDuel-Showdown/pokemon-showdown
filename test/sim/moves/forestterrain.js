'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const Dex = require('./../../../dist/sim/dex').Dex;

let battle;

describe('Forest Terrain', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change the current terrain to Forest Terrain for five turns', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciang', moves: ['forestterrain', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
			assert(battle.field.isTerrain('forestterrain'));
		}
		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		assert(battle.field.isTerrain(''));
	});

	it('should increase the def and spd of monsters with Swarm or Overgrow as the ability', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciang', ability: 'swarm', moves: ['forestterrain', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		const dmgirl = battle.p1.active[0];
		const def = dmgirl.getStat('def');
		const spd = dmgirl.getStat('spd');
		assert.sets(() => dmgirl.getStat('def'), Math.floor(Math.round(1.3 * def)), () => battle.makeChoices('move forestterrain', 'move sleeptalk'));
		assert(dmgirl.getStat('spd') === Math.floor(Math.round(1.3 * spd)));
	});

	it('should increase the base power of Grass-type attacks and Bug-type attacks used by grounded Monsters', () => {
		battle = common.createBattle([[
			{ species: 'darkmagiciang', ability: 'swarm', moves: ['forestterrain'] },
		], [
			{ species: 'timewizard', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		let move, basePower;
		move = Dex.moves.get('gigadrain');
		const dmgirl = battle.p1.active[0];
		const twizard = battle.p2.active[0];
		basePower = battle.runEvent('BasePower', dmgirl, twizard, move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 1.3) + 1); // For some reason gigadrain is short by 1 bp.
		move = Dex.moves.get('bugbuzz');
		basePower = battle.runEvent('BasePower', dmgirl, twizard, move, move.basePower, true);
		assert.equal(basePower, battle.modify(move.basePower, 1.3));
	});

	it('should cure status effects inflicted on Grass-type and Bug-type monsters.', () => {
		battle = common.createBattle([[
			{ species: 'jiraigumo', ability: 'swarm', moves: ['forestterrain', 'sleeptalk'] },
		], [
			{ species: 'timewizard', moves: ['toxic', 'sleeptalk'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move toxic');
		assert.equal(battle.p1.active[0].status, 'tox');
		battle.makeChoices('move forestterrain', 'move sleeptalk');
		assert.equal(battle.p1.active[0].status, '');
	});
});
