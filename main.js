"use strict";
	window.addEventListener('load', function() {
		//	 IMAGE LOAD SECTION ================================
		var body = document.getElementsByTagName("BODY")[0];
		var selectImage = document.querySelector("#selectImage");
		var uploadedImage = document.getElementById("uploadedImage");
		var resizeBtn = document.querySelector("#resizeBtn");
		var outputCanv = document.createElement("canvas");
		var outputImage = document.querySelector("#outputImage");
		var msgBox = document.querySelector("#msgBox");
		var fileInfo = document.querySelector("#file-info");
		var resizeBtn = document.querySelector("#resize-btn");
		var originalImageWidth, originalImageHeight, originalImageRatio;
		var newImageWidth, newImageHeight, newImgUrl;
		var isFileLoaded = false;
		var file = null;
		var mimeType = "image/jpeg";
		var roundFig = (x, d = 0) => {
			let dc = Math.pow(10, d);
			return Math.round(x * dc) / dc;
		}
		const inputWidth = document.querySelector("#inputWidth");
		const inputHeight = document.querySelector("#inputHeight");
		inputWidth.addEventListener("keyup", (e) => {
			inputHeight.value = roundFig(e.target.value / originalImageRatio, 2);
			//		inputHeight.value = (e.target.value * originalImageHeight )/originalImageWidth;
			resizeBtn.style.display = "block";
		})
		inputHeight.addEventListener("keyup", (e) => {
			inputWidth.value = roundFig(e.target.value * originalImageRatio, 2);
			//		inputWidth.value = (e.target.value * originalImageWidth )/originalImageHeight;
			resizeBtn.style.display = "block";
		})
		document.querySelector("#set-org-size").addEventListener("click",()=>{
			inputWidth.value = originalImageWidth;
			inputHeight.value = originalImageHeight
			//resizeBtn.style.display = "block";
			loadCanvas();
		})
		resizeBtn.addEventListener("click", (e) => {
			e.target.style.display = "none";
			loadCanvas()
		})
		selectImage.addEventListener("change", (event) => {
			body.style.opacity = 0.35;
			outputCanv.width = 0;
			URL.revokeObjectURL(newImgUrl);
			console.time('FileOpen');
			var files = event.target.files;
			if(files && files.length > 0) {
				isFileLoaded = true;
				//resizeBtn.style.display = "block";
				file = files[0];
				console.log(file)
				console.log(file.type);
				mimeType = file.type;
				// file reader for data url section
				var fileReaderForDataURL = new FileReader();
				fileReaderForDataURL.onloadend = function(e) {
					uploadedImage.src = e.target.result;
					// open all section on image onload
					// find image dimensions 
					var orgImgForDimenstion = new Image();
					orgImgForDimenstion.src = e.target.result;
					orgImgForDimenstion.onload = function() {
						originalImageHeight = this.naturalHeight || this.height;
						originalImageWidth = this.naturalWidth || this.width;
						originalImageRatio = originalImageWidth / originalImageHeight;
						inputHeight.value = roundFig(inputWidth.value / originalImageRatio, 2);
						document.querySelector(".image-size-wrap").style.display = "block";
						fileInfo.innerHTML = "<p>Original Size : " + rSize(file.size) + "<br> Original Dimension : " + originalImageWidth + "×" + originalImageHeight + "</p>";
						//fileInfo.innerHTML = "<p>File Name : "+file.name+"<br>File Size : " + rSize(file.size)+"<br> File Dimension : "+originalImageWidth+"×"+originalImageHeight+"</p>";
						loadCanvas();
						console.log("width :" + originalImageWidth + ", height : " + originalImageHeight)
							//	console.log("ratio : " + imageRatio(originalImageWidth, originalImageHeight));
						console.log("file name : ", file.name)
						console.log("last modified date : ", file.lastModifiedDate)
						console.log("file size : ", file.size, rSize(file.size))
					};
					// console image url data
					console.log(e.target.result)
				};
				fileReaderForDataURL.readAsDataURL(file);
			}
		})

		function loadCanvas() {
			body.style.opacity = 0.35;
			document.querySelector(".image-section-wrap").style.display = "block";
			console.log("run loadCanvas()");
			if(isFileLoaded) {
				var ctx = outputCanv.getContext("2d");
				newImageWidth = inputWidth.value;
				newImageHeight = roundFig(newImageWidth * originalImageHeight / originalImageWidth, 2);
				outputCanv.width = newImageWidth;
				outputCanv.height = newImageHeight;
				ctx.drawImage(uploadedImage, 0, 0, newImageWidth, newImageHeight);
				outputCanv.toBlob(function(blob) {
					let newImgSize = rSize(blob.size);
					let percent = roundFig((100 - (blob.size * 100 / file.size)), 2);
					let imageObject = new Image();
					imageObject.addEventListener("load",()=>{
						body.style.opacity = 1;
						//alert("image load.");
					})
					 newImgUrl = URL.createObjectURL(blob);
					 outputImage.src = newImgUrl;
					imageObject.src = newImgUrl;
					///document.querySelector("#i").appendChild(imageObject);
					msgBox.innerHTML = '<p>Reduced size : ' + percent + '%<br>New Size :' + newImgSize + '<br>Dimension : ' + newImageWidth + "×" + newImageHeight + '<br><a id="download-link" href="' + newImgUrl + '" download>Download</a><A4Canvas</p>';
				}, mimeType);
			} else {
				alert("file not uploaded")
			}
		}

		function rSize(size, r = false) {
			let divideBy;
			if(r) {
				divideBy = 1024;
			} else {
				divideBy = 1000;
			}
			let steps = 0;
			let tempDivideBy = divideBy;
			let result = "";
			let uName = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
			while(size > tempDivideBy) {
				tempDivideBy *= divideBy;
				steps++;
			}
			return(roundFig(size / Math.pow(divideBy, steps), 2)).toFixed(2) + " " + uName[steps];
		}
	})