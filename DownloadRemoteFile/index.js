let URL = window.URL || window.webkitURL;

function saveAs(blob, filename) {
	let type = blob.type;
	let force_saveable_type = 'application/octet-stream';
	if (type && type !== force_saveable_type) {
		let slice = blob.slice || blob.webkitSlice || blob.mozSlice;
		blob = slice.call(blob, 0, blob.size, force_saveable_type);
	}
	let url = URL.createObjectURL(blob);
	let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = url;
	save_link.download = filename;

	let event = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});
	save_link.dispatchEvent(event);
	URL.revokeObjectURL(url);
}

/**
 * @param {*} fileUrl: 文件url
 */
export default function handleDownLoad (fileUrl) {
  let oReq = new XMLHttpRequest();
  oReq.open('GET', fileUrl, true);
  oReq.responseType = "blob";
  oReq.onload = function() {
      let file = new Blob([oReq.response], { 
          type: 'application/pdf' 
      });
      saveAs(file,'XXX.pdf');
  };
  oReq.send();
}