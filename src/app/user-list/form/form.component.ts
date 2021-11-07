import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  srcResult: any;
  src: any;
  id: any;
  images: string = '';
  baseUrl = environment.baseUrl;
  passwordCheck: any;
  matchPwd: any;
  constructor(private fb: FormBuilder, private router: Router, private api: ApiService, private routes: ActivatedRoute, private _snackBar: MatSnackBar) { }
  form = this.fb.group({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  ngOnInit(): void {
    this.routes.params.subscribe((res: any) => {
      this.id = res.id;
      this.api.userById(this.id).subscribe((res: any) => {
        if (res) {
          this.images = res.image;
          res.password = undefined;
          this.form.patchValue(res);
        }
      });
    });
  }
  get f() {
    return this.form.controls;
  }
  submit() {
    const inputNode: any = document.querySelector('#file');
    const formData = new FormData();
    formData.append('file', inputNode.files[0]);
    formData.append('firstname', this.form.value.firstname);
    formData.append('lastname', this.form.value.lastname);
    formData.append('email', this.form.value.email);
    formData.append('password', this.form.value.password);
    if (this.id) {
      formData.append('id', this.id);
      this.api.updateUser(formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.snackbar(res.message);
          this.router.navigate(['']);
        }
        else {
          this.snackbar(res.message);
        }
      });
    }
    else {
      this.api.addUser(formData).subscribe((res: any) => {
        if (res.code == 200) {
          this.snackbar(res.message);
          this.router.navigate(['']);
        }
        else {
          this.snackbar(res.message);
        }
      });
    }
  }

  snackbar(message: string) {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    const verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: 5000
    });
  }

  back() {
    this.router.navigate(['']);
  }

  uploadFile() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
        this.src = reader.result;
      };
      reader.readAsDataURL(inputNode.files[0]);
    }
  }
  password(event: any) {
    this.passwordCheck = event?.target.value;
  }
  confirmPassword(event: any) {
    const confirmPwd = event?.target.value;
    if (confirmPwd.length >= this.passwordCheck.length) {
      if (this.passwordCheck != confirmPwd) {
        this.snackbar("Password doesn't match");
        this.matchPwd = true;
      }
      else{
        this.matchPwd = false;
      }
    }
  }
}
