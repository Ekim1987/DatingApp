import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users:User[];
  pagination:Pagination;
  likesParam:string

  constructor(
    private _authService:AuthService,
    private _userService:UserService,
    private _route:ActivatedRoute,
    private _alertify:AlertifyService) { }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUser();

  }

  loadUser() {
    this._userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage,null,this.likesParam)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this._alertify.error(error)
      }

      )
  }

}
