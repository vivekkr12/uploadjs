### Upload Parameters

The upload parameters that can be passed while creating the instance of `Uploader`.

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
| `onSuccess` | function(`file, response, xhr`) | Yes | `undefined` | Callback when uplaod is successfull <code>function (file, response, xhr) {}</code> |
| `onError` | function (`file, response, status, xhr`) | Yes | `undefined` | Callback when upload failed <code>function (file, response, status, xhr) {}</code> |
|`displayAddedFile`| function(`file`) | No | `undefined` | function to display added file while `customDisplay` is set to true. This parameter is mandatory when using custom display|
|`getSelectedFile`| function | No | `undefined` | function to get the selected file from custom display|
|`removeFileFromDisplay`| function(`file`) | No | `undefined` | function to remove added file from display while `customDisplay` is set to true. This parameter is mandatory when using custom display|
|`validateFile`| function (`file`, `onCheckPass`, `onCheckFail`) | `undefined` | No | A method to validate the file before adding. Implementors must invoke `onCheckPass` / `onCheckFail` within this method when the validation checks pass / fail. UploadJS will register `addFile` as `onCheckPass` callback |
|`onCheckFail`| function(`file`, `errorMsg`) | No | `undefined` | function invoked if file check fails. Required when validateFile is defined<code>function (file, errorMsg) {alert(file.name + " Invalid because " + errorMsg);}</code> |
| `setProgress` | function (`file, progress`) | No| `undefined` | function to set current  upload progress to render progress bar. Minimum progress value is 0 and maximum is 100 <code>function (file, progress) {}</code> |
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
| `preRemove` | function (`file`) | No | `undefined` | function invoked on a file before it is removed   <code>function(file) {// do pre remove stuff}</code> |
| `postRemove` | function (`file`) | No | `undefined` | function invoked on a file after it is added <code>function(file) {// do post remove stuff}</code> |
| `preUpload` | function (`file`) | No | `undefined` | function invoked on a file before upload starts <code>function(file) {// do pre upload stuff}</code> |
| `addPayload` | function (`file`) | No | `undefined` | function to add payload to be sent with file to server. This function must return a map. <code>function(file) {// return {payloadKey : "payLoadValue"};}</code> |
| `postUpload` | function (`file`) | No | `undefined` | function invoked when file upload is completed <code>function(file) {// do post upload stuff}</code> |
|`chunkSize` | Number | No | 1048576 (1 MB)| Chunk size when uploading large files |
|`removeAfterUploadSuccess` | boolean | No | false | boolean flag to remove file from list of added files after file has been successfully uploaded |
|`removeAfterUploadFail` | boolean | No | false | boolean flag to remove file from list of added files if upload fails afte upload attempt |
|`maxAddedFiles` | Number | No | 1000 | Maximum number of files that can be added before upload. |
|`onMaxFileExceed` | function(`maxFiles`) | No | `undefined` | function to be invoked if files are added beyond the max file limit. <code>function (maxFiles) {alert('Maximum of '+maxFiles+' can be added')}</code> |
