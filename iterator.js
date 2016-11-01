/*
 * Copyright (c) 2016 Vivek Kumar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*global File, FileList, alert, FileReader, Blob, console, FormData*/
/*jslint continue:true, node:true, vars:true*/

'use strict';

/**
 * Creates and Iterator for an Array which will expose the
 * friendly APIs of hasNext() and next() to loop though
 * the elements.
 * If elements are added and removed after creating the
 * Iterator, then it may misbehave.
 * @param {Array} arr The arry to create an Iterator
 */
function Iterator(arr) {
  this.arr = arr;
  this.pointer = 0;
}

/**
 * Checks if iterator contains more elements
 * @returns {boolean} true if Iterator has more elements,
 *                    false othewise.
 */
Iterator.prototype.hasNext = function () {
  return this.pointer <= this.arr.length - 1;
};

/**
 * Get the next element of the Iterator
 * @returns next element of the Iterator
 */
Iterator.prototype.next = function () {
  var element = this.arr[this.pointer];
  this.pointer += 1;
  return element;
};
