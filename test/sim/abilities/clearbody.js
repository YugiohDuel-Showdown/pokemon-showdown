'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Clear Body', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should negate stat drops from opposing effects', () => {
		battle = common.createBattle([[
			{ species: 'valkyrion', ability: 'clearbody', moves: ['recover'] },
		], [
			{ species: 'injflily', ability: 'intimidate', moves: ['acidspray', 'leer', 'scaryface', 'charm', 'confide'] },
		]]);

		const stats = ['spd', 'def', 'spe', 'atk', 'spa'];
		for (const [index, stat] of stats.entries()) {
			battle.makeChoices('move recover', 'move ' + (index + 1));
			assert.statStage(battle.p1.active[0], stat, 0);
		}
		for (const stat of stats) {
			assert.statStage(battle.p1.active[0], stat, 0);
		}
	});

	it('should not negate stat drops from the user\'s moves', () => {
		battle = common.createBattle([[
			{ species: 'valkyrion', ability: 'clearbody', moves: ['superpower'] },
		], [
			{ species: 'injflily', ability: 'unnerve', moves: ['coil'] },
		]]);
		battle.makeChoices('move superpower', 'move coil');
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p1.active[0], 'def', -1);
	});

	it('should not negate absolute stat changes', () => {
		battle = common.createBattle([[
			{ species: 'valkyrion', ability: 'clearbody', moves: ['coil'] },
		], [
			{ species: 'injflily', ability: 'unnerve', moves: ['topsyturvy'] },
		]]);
		battle.makeChoices('move coil', 'move topsyturvy');
		assert.statStage(battle.p1.active[0], 'atk', -1);
		assert.statStage(battle.p1.active[0], 'def', -1);
		assert.statStage(battle.p1.active[0], 'accuracy', -1);
	});

	it('should be suppressed by Mold Breaker', () => {
		battle = common.createBattle([[
			{ species: 'valkyrion', ability: 'clearbody', moves: ['recover'] },
		], [
			{ species: 'injflily', ability: 'moldbreaker', moves: ['growl'] },
		]]);
		battle.makeChoices('move recover', 'move growl');
		assert.statStage(battle.p1.active[0], 'atk', -1);
	});

	it('should be suppressed by Mold Breaker if it is forced out by a move', () => {
		battle = common.createBattle([[
			{ species: 'valkyrion', ability: 'clearbody', moves: ['recover'] },
			{ species: 'valkyrion', ability: 'clearbody', moves: ['recover'] },
		], [
			{ species: 'injflily', ability: 'moldbreaker', moves: ['roar', 'stickyweb'] },
		]]);
		battle.makeChoices('move recover', 'move stickyweb');
		battle.makeChoices('move recover', 'move roar');
		battle.makeChoices('switch 2', 'default');
		assert.statStage(battle.p1.active[0], 'spe', -1);
	});

	it('should not take priority over a stat being at -6', () => {
		battle = common.createBattle([[
			{ species: 'valkyrion', ability: 'clearbody', moves: ['bellydrum', 'sleeptalk'] },
		], [
			{ species: 'injflily', moves: ['topsyturvy', 'growl'] },
		]]);
		battle.makeChoices();
		battle.makeChoices('move sleeptalk', 'move growl');
		assert.statStage(battle.p1.active[0], 'atk', -6);
		assert(battle.log.includes('|-unboost|p1a: Valkyrion|atk|0'));
	});
});
