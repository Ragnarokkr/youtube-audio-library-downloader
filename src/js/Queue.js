/**
 * Queue.js - Limited queue class for Javascript
 *
 * @author Marco Trulla <dev@marcotrulla.it>
 * @version 0.0.1
 * @licence MIT
 * @copyright Copyright ©2017 MarcoTrulla.it
 *
 */

let Queue = (function (Mutex) {
    "use strict";

	/**
	 * Queue Class
	 *
	 * @param limit
	 * @constructor
	 */
	function Queue(limit) {
		this._limit = (limit === null || limit === undefined) ? -1 : Math.floor(limit);
		this._state = 0 /* Empty */;
		this._mutex = new Mutex();
		this._queue = [];
	}

	// Updates internal state according to queue length and settings
	Queue.prototype._updateState = function () {
		let length = this._queue.length;

		if (length === 0) {
			this._state = 0 /* Empty */;
		} else if (this._limit > 0 && length === this._limit) {
			this._state = 2 /* Full */;
		} else {
			this._state = 1 /* Filling */;
		}
	};

	/**
	 * Returns if the queue is empty.
	 *
	 * @returns {boolean}
	 */
	Queue.prototype.isEmpty = function () { return this._state === 0 /* Empty */; };

	/**
	 * Returns if the queue is full.
	 *
	 * If `length` parameter wasn't set, it always returns `false`.
	 * 
	 * @returns {boolean}
	 */
	Queue.prototype.isFull = function () { return this._state === 2 /* Full */; };

	/**
	 * Returns if the queue is currently used by another process.
	 *
	 * @returns {boolean}
	 */
	Queue.prototype.isWorking = function () { return this._mutex.isRunning(); };

	/**
	 * Adds a new element to the queue (only if the queue isn't busy).
	 *
	 * This method adds elements only until the length is less than the `limit`. If `limit` wasn't
	 * set, it acts like a normal array, but always checks for concurrent actions.
	 *
	 * @param {any} value value to add to the queue
	 *
	 * @throws Error throws an error if the queue is already busy
	 */
	Queue.prototype.add = function (value) {
		let thread = this._mutex.run();
		if (this._limit > 0 )
			if (this._queue.length < this._limit) this._queue.push(value);
		else
			this._queue.push(value);
		this._updateState();
		this._mutex.done(thread);
	};

	/**
	 * Removes an element from the queue (if any and whether the queue is not busy).
	 *
	 * @param {any} value the value to find for and remove
	 *
	 * @throws Error thrown an error if the queue is already busy.
	 */
	Queue.prototype.remove = function (value) {
		let thread = this._mutex.run();
		let index = this._queue.indexOf(value);
		if (index > 0) {
			this._queue.splice(index, 1);
			this._updateState();
		}
		this._mutex.done(thread);
	};

	/**
	 * Retrieves a queue element.
	 *
	 * @param {number} index the index of the element.
	 *
	 * @returns {any} 
	 */
	Queue.prototype.get = function (index) {
		if (this._state === 0 /* Empty */)	return;
		if (index >= 0 && index < this._queue.length) return this._queue[index];
	};

	/**
	 * Set the value of a queue element.
	 *
	 * @param {number} index the index of the element to set
	 * @param {any} value the value to assign to the element
	 *
	 * @throws Error throws an error if the queue is already busy.
	 */
	Queue.prototype.set = function (index, value) {
		let thread = this._mutex.run();
		if (this._state === 0 /* Empty */) return;
		if (index >= 0 && index < this._queue.length) this._queue[index] = value;
		this._mutex.done(thread);
	};

	/**
	 * @property {number} length the current length of the queue.
	 */
	Object.defineProperty(Queue.prototype, "length", {
		get: function () { return this._queue.length; },
		enumerable: true,
		configurable: true
	});

	return Queue;
})(Mutex);
