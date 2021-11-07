import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  tokenRes: any;
  constructor(private api: ApiService,private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.api.token.subscribe((res: any) => {
      this.tokenRes = res;
      localStorage.setItem('token', res);
    });
    let token: any = this.tokenRes ? this.tokenRes : localStorage.getItem("token");
    if (token) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;

  }

}
