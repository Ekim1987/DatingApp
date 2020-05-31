import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
//   font1 = {};
// red = 'michael';


  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  //  this.changeColor();
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
    this.galleryOptions = [{
     width: '500px',
     height: '500px',
     imagePercent: 100,
     thumbnailsColumns: 4,
     imageAnimation: NgxGalleryAnimation.Slide,
     preview: true,
     }];
    this.galleryImages = this.getImages();

  }
  getImages() {
    const imageUrls = [];
    for (let index = 0; index < this.user.photos.length; index++) {
      imageUrls.push({
        small: this.user.photos[index].url,
        medium: this.user.photos[index].url,
        big: this.user.photos[index].url,
        description: this.user.photos[index].description
      });
    }
 
    return imageUrls;
  }

  // changeColor(){
  //   if(this.red === 'michael'){
  //     this.font1 = { color: 'red', fontWeight: '900' };
  //   }
  //   else{
  //     this.font1 = { color: 'green', fontWeight: '900' };
  //   }
  
  // }
  // }

  
// loadUser() {
//     // to cast id into number put the + sign on front
//     this.userService.getUser(+this.route.snapshot.params.id).subscribe((user: User) => {
//       this.user = user;
//     }, error => {
//       this.alertify.error(error);
//     });
//   }
 }


