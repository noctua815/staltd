/*jshint esversion: 6 */

// localStorage Module

(function(Module, $) {
	$.extend(Module, {
		addStorage: function(key, value) {
			localStorage.setItem(key, JSON.stringify(value));
		},
		getStorage: function(key) {
			return JSON.parse(localStorage.getItem(key));
		},
		delStorage: function(key) {
			localStorage.removeItem(key)
		},
		addItem: function(storageName, key, value) {
			let storage = Module.getStorage(storageName);

			storage[key] = value;
			Module.addStorage(storageName, storage);
		},
		getItem: function(storageName, key) {
			let storage = Module.getStorage(storageName);

			return storage[key];
		},
		delItem: function(storageName, key) {
			let storage = Module.getStorage(storageName);

			delete storage[key];
			Module.addStorage(storageName, storage);
		}
	});

})(Storage = window.Storage || {}, $);
