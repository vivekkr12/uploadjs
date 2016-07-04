# Upload JS
An HTML5 and JavaScript based file uploader which lets you add and upload files one by one or simaltaneously. Upload Js works best with html table integration but it's upload method can be used independently.

### Features
* Add / upload multiple files at once
* Highly customizable with option to hook custom methods to be invoked before / after every action
* Chunked upload for large files
* Drag and drop support
* Option to add extra payload to be transfered as request parameter with file

## Usage

Include the dependencies, create a new instnace of `Uploader` and pass on the html elements as parameter.

```html
<!-- A table to list all added files. It will also be a dropzone to add drag and drop files to add -->
<table id="fileTable"></table>

<!-- Wrapping buttons in a form to reset the input type file -->
<form id="wrapperForm">
    <input type="file" id="addBtn" multiple>
    <input type="button" id="removeBtn" value="Remove">
    <input type="button" id="uploadBtn" value="Upload">
    <input type="button" id="removeAllBtn" value="Remove All">
</form>

<script type="text/javascript" src=upload.js ></script>
<script type="text/javascript">
    
  var uploadParameters = {
    fileTableId: "fileTable",
    addBtnId: "addBtn",
    removeBtnId: "removeBtn",
    uploadBtnId: "uploadBtn",
    removeAllBtnId: "removeAllBtn",
    wrapperFormId : "wrapperForm",
    serverUrl : "http://host:port/handler",
    onSuccess : function (file, response) {
      alert(response);
    },
    onError : function (file, response, statusText) {
      alert(response);
    }
  };
  
  var uploader = new Uploader(uploadParameters);
  
</script>
```

### Display of Added Files
Files added for upload are by default displayed in a HTML table. This view can be hidden or changed by setting the parameter `customDisplay` to `true` and then providing appropriate implementation of `displayAddedFile`, `removeFileFromDisplay` and `getSelectedFile` methods.

### Async File Validator
Often the file validation task is lengthy. For example reading a large file and verifying it's content. Such tasks need to asynchronous and addFile must be invoked afer file validation.
UplaodJS provies and option to add an asynchronous file validator which registers addFile method as a callback.

In the upload parameters set `asycFileValidator` to `true` and implement the `validateFile` method.

```javascript
asyncFileValidator : true,
validateFile : function (file, onCheckPass, onCheckFail) {
  var reader = new FileReader();
  var pass = true;
  reader.onloadend = function () {
    console.log('read file - validating...'+file.name);
    if (pass) {
      onCheckPass(file);
    } else {
      onCheckFail(file);
    }
  };
  reader.readAsArrayBuffer(file);
  console.log('started reading file '+file.name);
}
```

## Upload Parameters

| Option | Type | Required | Default | Description |
| ------ | ---- | -------- | ------- | ----------- |
|`customDisplay`| boolean | No | `false` | A boolean falg to indicate whether custom view for added files is implemented. |
| `fileTableId` | string | No | `undefined` | Id of the HTML table emelent to display added files. First row must be a table header. This table also behaves a a dropzone. Optional only when `customDisplay` is set to `true`  |
|`dropZone`| string | No | `undefined` | Id of the HTML element which is to be treated as dropzone for adding files with drag and drop support |
| `addBtnId` | string | Yes | `undefined` | Id of the `<input type="file">` button |
| `removeBtn` | string | Yes | `undefined` | Id of the remove button |
| `removeAllBtn` | string | Yes | `undefined` | Id of the remove all button |
| `uploadBtn` | string | Yes | `undefined` | Id of the upload button button |
| `wrapperFormId` | string | Yes | `undefined` | Id of the `form` element wrapping the buttons. Form element is required to wrap the buttons so as to reset input type file |
| `getFileDetails` | function | No | `undefined` | File Details to be displayed in the file table. <code>function (file) {<br>var fileDtls = {<br>  fileName : file.name,<br>  fileType : file.type,<br>  fileSize : file.size,<br>  fileLastMod : file.lastModified<br>};<br>return fileDtls;</code> |
|`selectedRowColor`| string | No | `#dffff1` | Color to highlight the selected row in file table |
| `serverUrl` | string | Yes | `undefined` | The URL of server to upload files |
| `onSuccess` | function(`file, response`) | Yes | `undefined` | Callback when uplaod is successfull <code>function (file, response) {}</code> |
| `onError` | function (`file, response, statusText`) | Yes | `undefined` | Callback when uplaod failed <code>function (file, response, statusText) {}</code> |
|`displayAddedFile`| function(`file`) | No | `undefined` | function to display added file while `customDisplay` is set to true. This parameter is mandatory when using custom display|
|`getSelectedFile`| function | No | `undefined` | function to get the selected file from custom display|
|`removeFileFromDisplay`| function(`file`) | No | `undefined` | function to remove added file from display while `customDisplay` is set to true. This parameter is mandatory when using custom display|
|`asycFileValidator`| boolean | `false` | No | A flag representing if an asynchronous file validator is implemented |
|`validateFile`| fucntion (`file`,`onCheckPass`,`onCheckFail`) | `false` | No | Amethod to validate the file before adding. Implementors must invole `onCheckPass` / `onCheckFail` within this method when the validation checks pass / fail |
| `setProgress` | function (`progress`) | No| `undefined` | function to set current  upload progress to render progress bar. Minimum progress value is 0 and maximum is 100 <code>function (progress) {}</code> |
| `getProgress` | function | No | `undefined` | function to get the current uplaod progress. <i>Required if setProgress is defined. to manage total progress in case of chunked uploads</i> <code>function () {<br>  return progress;}</code> |
| `preAddBtnAction` | function | No | `undefined` | function to execute any task before starting add action |
| `postAddBtnAction` | function | No | `undefined` | function to execute any task after add action is finished |
| `preRemoveBtnAction` | function | No | `undefined` | function to execute any task before starting remove action |
| `postRemoveBtnAction` | function | No | `undefined` | function to execute any task after remove action is finished |
| `preRemoveAllBtnAction` | function | No | `undefined` | function to execute any task before starting removeAll action |
| `preRemoveAllBtnAction` | function | No | `undefined` | function to execute any task after removeAll action is finished |
| `preUploadBtnAction` | function | No | `undefined` | function to execute any task before starting upload action |
| `postUploadBtnAction` | function | No | `undefined` | function to execute any task after upload action is finished |
| `preAdd` | function (`file`) | No | `undefined` | function invoked on a file before it is added <code>function(file) {// do pre add stuff}</code> |
|`postAdd` | function(`file`) | No | `undefined` | function invoked on a file after it is added <code>function(file) {// do post add stuff}</code> |
|`onDuplicateAdd` | function | No | `alert('File already Added')` | function invoked if a duplicate file is being added |
|`isValidFile` | function(`file`) | No | `undefined` | function invoked on a file before it is added to check if it's valid. function must return a boolean value. A false value from this methods prevents the file from being added <code>function(file){<br>return true;}</code> |
|`onCheckFail`| function | No | `undefined` | function invoked if file check fails. Required when isValidFile is defined<code>function (file)</code> |
| `preRemove` | function (`file`) | No | `undefined` | function invoked on a file before it is removed   <code>function(file) {// do pre remove stuff}</code> |
| `postRemove` | function (`file`) | No | `undefined` | function invoked on a file after it is added <code>function(file) {// do post remove stuff}</code> |
| `preUpload` | function (`file`) | No | `undefined` | function invoked on a file before upload starts <code>function(file) {// do pre upload stuff}</code> |
| `addPayload` | function (`file`) | No | `undefined` | function to add payload to be sent with file to server. This function must return a map. <code>function(data) {// do pre upload stuff}</code> |
| `postUpload` | function (`file`) | No | `undefined` | function invoked when file upload is completed <code>function(file) {// do post upload stuff}</code> |
|`chunkSize` | Number | No | 1048576 (1 MB)| Chunk size when uploading large files |

## Demo
##### For Default behaviour
See <a href="https://github.com/vivekkr12/uploadjs/blob/master/demo/demo.html">demo/demo.html</a>

##### For custom display 
See <a href="https://github.com/vivekkr12/uploadjs/blob/master/demo/demo-custom-display.html">demo/demo-custom-display.html</a>

##### For asynchronous file validator
See <a href="https://github.com/vivekkr12/uploadjs/blob/master/demo/demo-async-file-validator.html">demo-async-file-validator.html</a>

## Guide for Server Code

* File data / blob is sent to server with request parameter named `blob`
* Original file name is sent as a request parameter named `name`
* A parameter named `totalChunks` (integer type) is sent indicating total number of chunks
* A parameter named `eof` (boolean type) is sent indicating the last chunk. True if current chunk sent to server is last chunk, false otherwise

#### Sample server code using java servlets is included
To run the server code execute

`$ mvn clean compile exec:java` 

from `server/java/uplaodjs-server` directory

##### *Pull reqeust for server code in other languages are welcome*
