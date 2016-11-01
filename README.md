# Upload JS
An HTML5 and JavaScript based file uploader which lets you add and upload files one by one or simultaneously. Upload JS displays added files in a html table but custom displays can be implemented.

## Features
* Vanilla JavaScript and no third party dependencies
* Add / upload multiple files at once
* Highly customizable with option to hook custom methods to be invoked before / after every action
* Chunked upload for large files with option to set chunk size
* Drag and drop support
* Option to add extra payload to be transferred as request parameter with file

## Build

Use [nodejs](https://nodejs.org/en/) and [gulp](http://gulpjs.com/) to build the combined and minified js file. Clone the repo and from the project root run

```
$ npm install
$ gulp
```
Include the `dist/upload.min.js` file in webpage. Alternatively the minified file can also be downloaded from releases.

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
      // on success invoked when status is 200
      alert(response);
    },
    onError : function (file, response, status) {
      alert(response);
    }
  };

  var uploader = new Uploader(uploadParameters);

</script>
```

### Display of Added Files
Files added for upload are by default displayed in a HTML table. This view can be hidden or changed by setting the parameter `customDisplay` to `true` and then providing appropriate implementation of `displayAddedFile`, `removeFileFromDisplay` and `getSelectedFile` methods.

### File Validator
Sometimes files must be validated before upload. For example reading a large file and verifying it's content. UplaodJS provies and option to add a file validator which registers addFile method as a callback.

In the upload parameters implement and register `validateFile` method.

```javascript
validateFile : function (file, onCheckPass, onCheckFail) {
  var reader = new FileReader();
  var pass = true;
  reader.onloadend = function () {
    console.log('read file - validating...'+file.name);
    if (pass) {
      onCheckPass(file); // must be called by implementor on check pass
    } else {
      onCheckFail(file, "Not a valid file");
      return false; // return false to prevent further execution
    }
  };
  reader.readAsArrayBuffer(file);
  console.log('started reading file '+file.name);
}
```

## Upload Parameters
Upload Parameters are mentioned in the [API docs](api-docs.md).

## Demo
##### For Default behaviour
See [demo/demo.html](demo/demo.html)

##### For custom display
See [demo/demo-custom-display.html](demo/demo-custom-display.html)

## Guide for Server Code

* File data / blob is sent to server with request parameter named `blob`
* Original file name is sent as a request parameter named `name`
* A parameter named `totalChunks` (integer type) is sent indicating total number of chunks
* A parameter named `eof` (boolean type) is sent indicating the last chunk. True if current chunk sent to server is last chunk, false otherwise

#### Sample server code using java servlets is included
To run the server code execute

`$ mvn clean compile exec:java`

from `server/java/uplaodjs-server` directory

## License
[MIT](LICENSE.md)

##### *Pull reqeusts are welcome*
