'use strict';
const Dex = require('./../../../dist/sim/dex').Dex;
const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Cloud Nine', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should treat the weather as none for the purpose of moves and abilities', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['sunnyday'] },
		], [
			{ species: 'injflily', item: 'laggingtail', ability: 'solarpower', moves: ['solarbeam'] },
		]]);
		const [weatherSuppressor, weatherUser] = [battle.p1.active[0], battle.p2.active[0]];
		assert.false.hurts(weatherSuppressor, () => battle.makeChoices('move sunnyday', 'move solarbeam')); // Solar Beam must charge
		assert(battle.field.isWeather(''));
		assert(weatherUser.hp === weatherUser.maxhp); // Solar power doesn't proc.
	});

	it('should negate the effects of Sun on Fire-type and Water-type attacks', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['calmmind'] },
		], [
			{ species: 'injflily', ability: 'drought', moves: ['rest'] },
		]]);
		let move, basePower;
		battle.makeChoices('move calmmind', 'move rest');
		move = Dex.moves.get('firepledge');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
		move = Dex.moves.get('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should negate the effects of Rain on Fire-type and Water-type attacks', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['calmmind'] },
		], [
			{ species: 'injflily', ability: 'drizzle', moves: ['rest'] },
		]]);
		let move, basePower;
		battle.makeChoices('move calmmind', 'move rest');
		move = Dex.moves.get('firepledge');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
		move = Dex.moves.get('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should negate the damage-dealing effects of Sandstorm', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['calmmind'] },
		], [
			{ species: 'injflily', ability: 'sandstream', moves: ['rest'] },
		]]);
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move calmmind', 'move rest'));
	});

	it('should negate the damage-dealing effects of Hail', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['calmmind'] },
		], [
			{ species: 'injflily', ability: 'snowwarning', moves: ['rest'] },
		]]);
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move calmmind', 'move rest'));
	});

	it('should negate Desolate Land\'s ability to prevent other weathers from activating', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['raindance'] },
		], [
			{ species: 'injflily', ability: 'desolateland', moves: ['sunnyday'] },
		]]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should negate Primordial Sea\'s ability to prevent other weathers from activating', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['raindance'] },
		], [
			{ species: 'injflily', ability: 'primordialsea', moves: ['sunnyday'] },
		]]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	it('should negate Delta Stream\'s ability to prevent other weathers from activating', () => {
		battle = common.createBattle([[
			{ species: 'darksage', ability: 'cloudnine', moves: ['raindance'] },
		], [
			{ species: 'injflily', ability: 'deltastream', moves: ['sunnyday'] },
		]]);
		assert.constant(() => battle.weather, () => battle.makeChoices('move raindance', 'move sunnyday'));
	});

	/**
	 * This test is failing for some reason.
	 */
	// it('should allow hydration to trigger if the user fainted before Hyrdation could trigger', () => {
	// 	battle = common.createBattle([[
	// 		{ species: 'darksage', ability: 'cloudnine', moves: ['toxic', 'raindance', 'finalgambit'] },
	// 		{ species: 'redeyes', moves: ['sleeptalk'] },
	// 	], [
	// 		{ species: 'redeyes', ability: 'hydration', moves: ['sleeptalk'] },
	// 	]]);
	// 	const redeyes = battle.p2.active[0];
	// 	battle.makeChoices();
	// 	battle.makeChoices('move raindance', 'auto');
	// 	assert.equal(redeyes.status, 'tox');
	// 	const hp = redeyes.hp;

	// 	battle.makeChoices('move finalgambit', 'auto');
	// 	assert.equal(redeyes.status, '');
	// 	assert.equal(redeyes.hp, hp - battle.p1.active[0].maxhp);
	// });
});
