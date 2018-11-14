function replaceAll(str, find, replace) {
	if (str) {
		return str.replace(new RegExp(find, 'g'), replace);
	}
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ").replace('.', ',');
}

function getData(data) {
	if (!data) {
		return false;
	}

	var newStr = replaceAll(data, '\'', '"');

	if (newStr.indexOf('{') < 0) {
		return;
	}

	return JSON.parse(newStr);
}
