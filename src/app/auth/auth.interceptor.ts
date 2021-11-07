import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../api/api.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    tokenRes: any;
    constructor(private api: ApiService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.api.token.subscribe((res: any) => {
            this.tokenRes = res;
            localStorage.setItem('token', res);
        });
        let token: any = this.tokenRes ? this.tokenRes : localStorage.getItem("token");
        if (!token) {
            return next.handle(req);
        }
        let tokenReq = req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });
        return next.handle(tokenReq);
    }
}