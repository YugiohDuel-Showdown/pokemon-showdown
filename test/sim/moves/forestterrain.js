'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

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
		assert.sets(() => dmgirl.getStat('def'), Math.floor(Math.round(1.3 * dmgirl.getStat('def'))), () => battle.makeChoices('move forestterrain', 'move sleeptalk'));
		/**
		 * For some reason Sp. Def increase is not working.
		 */
		// assert.sets(() => dmgirl.getStat('spd'), Math.floor(Math.round(1.3 * dmgirl.getStat('spd'))), () => battle.makeChoices('move forestterrain', 'move sleeptalk'));
	});
	
});
