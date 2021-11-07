import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private api: ApiService, private _snackbar: MatSnackBar, private router: Router) { }
  form = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  ngOnInit(): void {
  }

  submit() {
    this.api.login(this.form.value).subscribe((res: any) => {
      if (res.code == 200) {
        this.api.token.next(res.token);
        this.router.navigate(['']);
        this.snackbar(res.message);
      }
      else {
        this.snackbar(res.message);
      }
    });
  }

  snackbar(message: string) {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    const verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    this._snackbar.open(message, 'Ok', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: 5000
    });
  }

}
