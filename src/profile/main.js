var fileuploadfor = document.getElementById('profileimage')
     
var uploadfile = document.getElementById('uploadimage');
var file = document.getElementById('files');
// var uploadimg = document.getElementById('display-picture');
// var uploadimg1 = document.getElementById('display-picture1');

console.log("profile",localStorage.name.concat(localStorage.image))
uploadimg.src= `/uploads/${localStorage.name.concat(localStorage.image)}`
uploadimg1.src= `/uploads/${localStorage.name.concat(localStorage.image)}`
console.log("upload",)
uploadfile.addEventListener('click',function(){
    console.log("hii used for file upload")
    file.click();
})
fileuploadfor.addEventListener("change", (e) => {
    console.log("helllo",e.target.files[0])
e.preventDefault();
const formData = new FormData();
const profile = e.target.files
formData.append("images",profile[0])
console.log("filess",formData)
axios.post("/api/profiles",formData, {
params:{name:localStorage.name},
headers: {
  "Content-Type": "multipart/form-data",
},
})
.then((res) => {
    const imgdata = res.data.path
    console.log("uploadimg",uploadimg.src,)
  uploadimg.src = imgdata
  uploadimg1.src = imgdata
  uploadimg.src =  uploadimg.src.replace("/profile/src","")
  uploadimg1.src = uploadimg1.src.replace("/profile/src","")
  console.log("uploadimg968++",uploadimg.src);
// document.getElementById('meetingmaterial').textContent=res.data.file.filename;
console.log(res.data.path,uploadimg.src);

})
.catch((err) => {
console.log(err);
});
});


var nameinputfield  = document.getElementById('nameinputfield');
var jobroleinputfield = document.getElementById('jobroleinputfield');
var emailinputfield = document.getElementById('emailinputfield');
var employeeinputfield = document.getElementById('employeeinputfield');
nameinputfield.value = localStorage.name;
jobroleinputfield.value = localStorage.usertype;
emailinputfield.value = localStorage.email;
employeeinputfield.value = localStorage.company_id;
// file.onchange = function () {
//     var filedata =file.files[0];
//     console.log("file uploaded",)
//     const reader =new FileReader();
//     reader.addEventListener("load",()=>{
//     //    var data = Buffer.from(reader.result).toString('base64');
//         console.log(reader.result);
//     })
//     reader.readAsDataURL(filedata);
// }