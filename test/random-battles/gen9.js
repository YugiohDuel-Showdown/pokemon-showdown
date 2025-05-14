/**
 * Tests for Gen 9 randomized formats
 */
'use strict';

const { testAlwaysHaveItem } = require('./tools');
describe('[Gen 9] Random Battle (slow)', () => {
	const options = { format: 'gen9randombattle' };
	it('should always give Winged Krb flame orb', () => {
		testAlwaysHaveItem('wingedkrb', options, 'Flame Orb');
	});
	// it('should always give Baton Pass to AlligatorS DGN', () => {
	// 	testAlwaysHasMove('alligatorsdgn', options, 'batonpass');
	// });
});
