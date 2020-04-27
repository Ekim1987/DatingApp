import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    // return this.userService.getUser(route.params['id']);
    return this.userService.getUser(route.params.id).pipe(
      catchError((error) => {
        this.alertify.error('Proble retrieving data');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }
}