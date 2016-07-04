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

/**
 * Creates an instance of a new Uploader with
 * the given upload patameters.
 * @param {json} parameters The upload parameters
 */
function Uploader(parameters) {

  this.filesToBeUploaded = []; // an array to hold all the added files
  this.fileTable = document.getElementById(parameters.fileTableId);
  this.dropZone = document.getElementById(parameters.dropZoneId);
  this.addBtn = document.getElementById(parameters.addBtnId);
  this.removeBtn = document.getElementById(parameters.removeBtnId);
  this.uploadBtn = document.getElementById(parameters.uploadBtnId);
  this.removeAllBtn = document.getElementById(parameters.removeAllBtnId);
  this.serverUrl = parameters.serverUrl;
  this.wrapperForm = document.getElementById(parameters.wrapperFormId);

  this.setProgress = parameters.setProgress;
  this.getProgress = parameters.getProgress;

  this.getFileDetails = parameters.getFileDetails;
  this.selectedRowColor = typeof parameters.selectedRowColor === 'undefined' ? "#dffff1" : parameters.selectedRowColor;

  this.customDisplay = typeof parameters.customDisplay === 'undefined' ? false : parameters.customDisplay;

  if (this.customDisplay) {

    if (typeof parameters.displayAddedFile === 'undefined' || typeof parameters.removeFileFromDisplay === 'undefined') {

      throw "For custom display, two methods displayAddedFile and removeFileFromDisplay must be implemented";
    }

    this.displayAddedFile = parameters.displayAddedFile;
    this.getSelectedFile = parameters.getSelectedFile;
    this.removeFileFromDisplay = parameters.removeFileFromDisplay;
  }

  /* Set this to a reference to use in event listeners */
  var uploader = this;

  var preAdd = parameters.preAdd;
  var postAdd = parameters.postAdd;
  var onDuplicateAdd = parameters.onDuplicateAdd;
  var validateFile = parameters.validateFile;
  var onCheckFail = parameters.onCheckFail;

  var preRemove = parameters.preRemove;
  var postRemove = parameters.postRemove;

  var preUpload = parameters.preUpload;
  var addPayload = parameters.addPayload;
  var postUpload = parameters.postUpload;

  var onSuccess = parameters.onSuccess;
  var onError = parameters.onError;

  var preAddBtnAction = parameters.preAddBtnAction;
  var postAddBtnAction = parameters.postAddBtnAction;

  var preRemoveBtnAction = parameters.preRemoveBtnAction;
  var postRemoveBtnAction = parameters.postRemoveBtnAction;

  var preRemoveAllBtnAction = parameters.preRemoveAllBtnAction;
  var postRemoveAllBtnAction = parameters.postRemoveAllBtnAction;

  var preUploadBtnAction = parameters.preUploadBtnAction;
  var postUploadBtnAction = parameters.postUploadBtnAction;

  this.chunkSize = typeof parameters.chunkSize !== 'undefined' ? parameters.chunkSize : this.DEFAULT_CHUNK_SIZE;

  /**
   * Function invoked when files are selected from input 
   * type file or dropped into the drop zone
   * @param {Array} filesSelected An array of selected files
   */
  var handleSelectedFiles = function (filesSelected) {
    if (preAddBtnAction) {
      preAddBtnAction();
    }

    var addFileActivity = function (file) {
      if (preAdd) {
        preAdd(file);
      }
      uploader.addFile(file);
      if (postAdd) {
        postAdd(file);
      }
    };

    var file, i;
    for (i = 0; i < filesSelected.length; i += 1) {
      file = filesSelected[i];
      if (uploader.filesToBeUploaded.contains(file)) {
        if (onDuplicateAdd) {
          onDuplicateAdd(file);
        } else {
          alert('This file already exists');
        }
        continue;
      }

      if (validateFile) {
        validateFile(file, addFileActivity, onCheckFail);
      } else {
        addFileActivity(file);
      }
    }

    uploader.resetAddBtn();

    if (postAddBtnAction) {
      postAddBtnAction();
    }

  };

  this.addBtn.addEventListener('change', function (evt) {
    var filesSelected = uploader.addBtn.files;
    handleSelectedFiles(filesSelected);
  });

  if (this.fileTable) {
    this.fileTable.addEventListener('dragover', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    });

    this.fileTable.addEventListener('drop', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var fileSelected = evt.dataTransfer.files;
      handleSelectedFiles(fileSelected);
    });
  }

  if (this.dropZone) {
    this.dropZone.addEventListener('dragover', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    });

    this.dropZone.addEventListener('drop', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var fileSelected = evt.dataTransfer.files;
      handleSelectedFiles(fileSelected);
    });
  }

  this.removeBtn.addEventListener('click', function () {

    if (preRemoveBtnAction) {
      preRemoveBtnAction();
    }
    var file;
    if (uploader.customDisplay) {
      if (uploader.getSelectedFile) {
        file = uploader.getSelectedFile();
      } else if (uploader.filesToBeUploaded.length === 1) {
        file = uploader.filesToBeUploaded[0];
      } else {
        throw "In custom display, getSelectedFile must be implemented when adding multiple files";
      }

      if (file) {
        if (preRemove) {
          preRemove(file);
        }
        uploader.remove(file);
        if (postRemove) {
          postRemove(file);
        }
      }

    } else {
      var allCheckBoxes = document.getElementsByClassName("fileRowCheckBox");
      var i, checkbox;
      for (i = allCheckBoxes.length - 1; i >= 0; i -= 1) {
        checkbox = allCheckBoxes[i];
        if (checkbox.checked === true) {
          var tr = checkbox.parentElement.parentElement;
          var rowIndex = tr.rowIndex;
          file = uploader.filesToBeUploaded[rowIndex - 1];
          if (preRemove) {
            preRemove(file);
          }
          uploader.remove(file);
          if (postRemove) {
            postRemove(file);
          }
        }
      }
    }

    if (postRemoveBtnAction) {
      postRemoveBtnAction();
    }

  });

  this.removeAllBtn.addEventListener('click', function () {

    if (preRemoveAllBtnAction) {
      preRemoveAllBtnAction();
    }

    var file, i;
    for (i = uploader.filesToBeUploaded.length; i > 0; i -= 1) {
      file = uploader.filesToBeUploaded[i - 1];
      uploader.remove(file);
    }
    if (postRemoveAllBtnAction) {
      postRemoveAllBtnAction();
    }

  });

  this.uploadBtn.addEventListener('click', function () {
    if (preUploadBtnAction) {
      preUploadBtnAction();
    }

    var file;
    if (uploader.customDisplay) {
      file = uploader.getSelectedFile();
    } else {
      var allCheckBoxes = document.getElementsByClassName("fileRowCheckBox");
      if (allCheckBoxes.length === 1) {
        file = uploader.filesToBeUploaded[0];
      } else {
        var i, checkbox;
        for (i = allCheckBoxes.length - 1; i >= 0; i -= 1) {
          checkbox = allCheckBoxes[i];
          if (checkbox.checked === true) {
            file = uploader.filesToBeUploaded[i];
            break;
          }
        }
      }
    }
    if (file) {
      if (preUpload) {
        preUpload(file);
      }
      var payload;
      if (addPayload) {
        payload = addPayload(file);
      }
      uploader.uploadFile(file, onSuccess, onError, payload);
      if (postUpload) {
        postUpload(file);
      }
    }

    if (postUploadBtnAction) {
      postUploadBtnAction();
    }

  });

}

Uploader.isSupported = function () {
  return (File && FileList && FileReader && Blob && XMLHttpRequest);
};

Uploader.prototype = {
  constructor: Uploader,
  DEFAULT_CHUNK_SIZE: 1048576, // 1 MB

  resetAddBtn: function () {
    this.wrapperForm.reset();
  },

  addFile: function (file) {

    if (this.customDisplay) {
      this.displayAddedFile(file);
    } else {

      var fileDtls;
      if (this.getFileDetails) {
        fileDtls = this.getFileDetails(file);
      } else {
        fileDtls.fileName = file.name;
        fileDtls.fileType = file.type;
        fileDtls.fileSize = file.size;
        fileDtls.fileLastModified = file.lastModified;
      }

      var row = this.fileTable.insertRow();
      var selectedRowColor = this.selectedRowColor;
      row.insertCell().innerHTML = "<input type='checkbox' class='fileRowCheckBox'>";
      row.style.cursor = "pointer";
      var checkBox = row.getElementsByClassName('fileRowCheckBox')[0];
      row.addEventListener('click', function () {
        if (checkBox.checked) {
          checkBox.checked = false;
          row.style.backgroundColor = "#ffffff";
        } else {
          checkBox.checked = true;
          row.style.backgroundColor = selectedRowColor;
        }
      });

      checkBox.addEventListener('click', function () {
        if (checkBox.checked) {
          checkBox.checked = false;
          row.style.backgroundColor = "#ffffff";
        } else {
          checkBox.checked = true;
          row.style.backgroundColor = selectedRowColor;
        }
      });

      var i;
      for (i in fileDtls) {
        if (fileDtls.hasOwnProperty(i)) {
          row.insertCell().innerHTML = fileDtls[i];
        }
      }
    }

    this.filesToBeUploaded.push(file);

  },

  remove: function (file) {
    if (this.customDisplay) {
      this.removeFileFromDisplay(file);
      this.filesToBeUploaded.removeByElement(file);
    } else {
      var rowIndex = this.filesToBeUploaded.indexOf(file) + 1;
      this.fileTable.deleteRow(rowIndex);
      this.filesToBeUploaded.removeByIndex(rowIndex - 1);
    }

  },

  uploadFile: function (file, onSuccess, onError, payload) {
    /* Prepare to Uplaod*/

    var uploader = this;
    var uploadXhr = new XMLHttpRequest();
    var start = 0;
    var chunkSize = this.chunkSize;
    var end = start + chunkSize;
    var bytesLeft = file.size;
    var totalChunks = file.size % chunkSize === 0 ? parseInt(file.size / chunkSize, 10) : parseInt(file.size / chunkSize, 10) + 1;

    var sendRequest = function () {
      uploadXhr.open('POST', uploader.serverUrl, true);
      var data = new FormData();
      data.append("name", file.name);
      data.append("blob", file.slice(start, end));
      data.append("totalChunks", totalChunks);
      start = end;
      end = start + chunkSize;
      bytesLeft -= chunkSize;

      if (bytesLeft <= 0) {
        data.append("eof", true);
        var x;
        for (x in payload) {
          if (payload.hasOwnProperty(x)) {
            data.append(x, payload[x]);
          }
        }
      } else {
        data.append("eof", false);
      }

      uploadXhr.send(data);
    };

    var uploadProgress;
    var progressDivisons = 100 / totalChunks;
    var initialValue = 0;
    uploadXhr.upload.onprogress = function (evt) {
      if (uploader.setProgress) {
        if (evt.lengthComputable) {
          uploadProgress = initialValue + ((evt.loaded / evt.total) * progressDivisons);
          uploader.setProgress(uploadProgress);
        }
      }
    };

    uploadXhr.upload.onloadend = function (evt) {
      initialValue = uploader.getProgress();
    };

    uploadXhr.onreadystatechange = function (evt) {
      var xhr = evt.target;
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        if (bytesLeft > 0) {
          sendRequest(xhr);
        } else {
          if (uploader.setProgress) {
            uploader.setProgress(100);
          }
          onSuccess(file, xhr.response);
        }
      } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
        onError(file, xhr.response, xhr.statusText);
      }
    };
    sendRequest(uploadXhr);
  }
};
