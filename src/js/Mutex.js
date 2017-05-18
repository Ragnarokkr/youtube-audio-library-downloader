/**
 * Mutex.js - Simple stupid mutex class for Javascript
 *
 * @author Marco Trulla <dev@marcotrulla.it>
 * @version 0.0.1
 * @licence MIT
 * @copyright Copyright ©2017, by MarcoTrulla.it
 *
 */

let Mutex = (function () {
	"use strict";

	/**
	 * Mutex class
	 *
	 * @method {string} run locks mutex and generates thread ID
	 * @method {null} done unlock mutex
	 * @method {boolean} isRunning returns current mutex state
	 *
	 * @constructor
	 */
	function Mutex() {
		this._isRunning = false;
		this._thread = null;
	}

	// Thread ID generator
	Mutex.prototype._threadFactory = function () {
		let random = Math.floor(Math.random() * Math.pow(2, 40));
		let sign = (-1 + Math.floor(Math.random() * 3));
		return (Math.floor(sign !== 0 ? random * sign : random / 2) + Date.now()).toString(16);
	};

	/**
	 * Returns the current mutex state.
	 *
	 * @returns {boolean}
	 */
	Mutex.prototype.isRunning = function () { return this._isRunning; };

	/**
	 * Locks the mutex and returns the thread ID.
	 *
	 * Returned thread ID must be used to subsequently unlock the mutex.
	 *
	 * @returns {string|null}
	 */
	Mutex.prototype.run = function () {
		if (this._isRunning)
			throw new Error('Mutex already running.');
		this._isRunning = true;
		this._thread = this._threadFactory();
		return this._thread;
	};

	/**
	 * Unlock the mutex.
	 *
	 * @param {string} thread ID of previously locking thread
	 */
	Mutex.prototype.done = function (thread) {
		if (this._isRunning && thread !== this._thread)
			throw new Error('Mutex already owned by another thread.');
		this._isRunning = false;
		this._thread = null;
	};

	return Mutex;
})();
