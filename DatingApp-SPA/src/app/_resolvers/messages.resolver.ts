import { Injectable } from '@angular/core';

import {
  Resolve,
  Router,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../_models/_message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer ='Unread'
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService:AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    // return this.userService.getUser(route.params['id']);
    return this.userService.getMessage(this.authService.decodeToken.nameid,
        this.pageNumber,this.pageSize,this.messageContainer).pipe(
      catchError((error) => {
        this.alertify.error('Proble retrieving messages');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
