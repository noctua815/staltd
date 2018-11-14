/*jshint esversion: 6 */

function declOfNum(titles, number) {
	let cases = [2, 0, 1, 1, 1, 2];
    number = Math.abs(number);

	return function(number) {
		return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
	}
}
