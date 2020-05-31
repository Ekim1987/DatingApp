import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { resolve } from 'url';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos: Photo[];
@Output() getMemberPhotoChange = new EventEmitter<string>()
currentMain: Photo;
uploader:FileUploader;
hasBaseDropZoneOver=false;
response:string;
baseUrl= environment.apiUrl;

constructor 
(
  private authService:AuthService,
  private userService: UserService,
  private alertify:AlertifyService){}
 
ngOnInit() {
  this.initialiseFileUploader();
}

initialiseFileUploader(){
  this.uploader = new FileUploader({
    url:this.baseUrl + 'users/'+ this.authService.decodeToken.nameid + '/photos',
    authToken: 'Bearer ' + localStorage.getItem('token'),
    isHTML5: true,
    allowedFileType:['image'],
    removeAfterUpload:true,
    autoUpload:false,
    maxFileSize: 10 * 1024 * 1024
    // disableMultipart:true
  });
  this.uploader.onAfterAddingFile = (file) =>{file.withCredentials = false};
 this.uploader.onSuccessItem = (item,response,status,header)=>{
   if(response){
     console.log(response);
const res:Photo = JSON.parse(response);
const photo = {
  id:res.id,
  url:res.url,
  dateAdded:res.dateAdded,
  description:res.description,
  isMain:res.isMain
};
this.photos.push(photo);
   }
 }
}

fileOverBase(e:any):void {
  this.hasBaseDropZoneOver = e;
}
setMainPhoto(photo:Photo){
  this.userService.setMainPhoto(this.authService.decodeToken.nameid,photo.id).subscribe(()=>{
console.log("success image changed");

this.currentMain = this.photos.filter(p => p.isMain == true)[0];
 this.currentMain.isMain = false;
 photo.isMain = true;
//  this.getMemberPhotoChange.emit(photo.url);
this.authService.changeMemberPhoto(photo.url);
this.authService.currentUser.photoUrl = photo.url;
localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
  },error =>{
    this.alertify.error(error);
  }

  )
}
// fileOverAnother(e:any):void {
//   this.hasAnotherDropZoneOver = e;
// }
deletePhoto(id:number){
  this.alertify.confirm("Are you sure you want to delete the this photo", () => {
    this.userService.deletePhoto(this.authService.decodeToken.nameid,id).subscribe(()=>{
      this.photos.splice(this.photos.findIndex(p => p.id === id),1);
this.alertify.success('Photo has been deleted');
    },error =>{ 
      this.alertify.error("falied to delete the photo");
    });
  })
}
}
