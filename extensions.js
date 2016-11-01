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

/* Add an equals method to File prototype to check and disallow duplicates*/
if (File) {
  /**
   * Compares two files on basis of file name,
   * file size, file type and file's last modified
   * timestamp.
   * @param   {File}    arg the file isntance to compare with
   * @returns {boolean} true if arg is same false otherwise
   */
  File.prototype.equals = function (arg) {
    return (this.name === arg.name &&
      this.size === arg.size &&
      this.type === arg.type &&
      this.lastModified === arg.lastModified);
  };

}

/**
 * Checks if an array contains an element. Checks '=='
 * operator and falls back to eqauls method if available.
 * @param   {object}  element
 * @returns {boolean} true or false indicating if element
 *                    is present in the array.
 */
Array.prototype.contains = function (element) {

  if (this.indexOf(element) > -1) {
    return true;
  }

  var currentElement;
  var i;
  for (i = 0; i < this.length; i += 1) {
    currentElement = this[i];
    if (element.equals && (typeof element.equals) === "function") {
      if (currentElement.equals(element)) {
        return true;
      }
    } else {
      if (currentElement === element) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Removes an element from an Array
 * @param {object} element The element to remove
 */
Array.prototype.removeByElement = function (element) {
  var indexOfElement = this.indexOf(element);
  if (indexOfElement > -1) {
    this.splice(indexOfElement, 1);
  }
};

/**
 * Removes and element from an Array
 * @param {number} index The index of the element to remove
 */
Array.prototype.removeByIndex = function (index) {
  this.splice(index, 1);
};
