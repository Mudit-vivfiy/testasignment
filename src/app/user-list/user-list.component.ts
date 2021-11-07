import { Component, Inject, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(public dialog: MatDialog, private router: Router, private api: ApiService, private _snackBar: MatSnackBar, private domSanitizer: DomSanitizer) { }
  ngOnInit() {
    this.getAllUserData();
  }
  getAllUserData() {
    this.api.getAllUser().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  add() {
    this.router.navigate(['form']);
  }
  view(id: number) {
    this.api.userById(id).subscribe((res: any) => {
      this.dialog.open(ViewDialog, {
        data: res,
      });
    });
  }
  edit(id: number) {
    this.router.navigate([`form/${id}`]);
  }
  deleteData(id: number) {
    const dialog = this.dialog.open(DeleteDialog, {
      data: {
        id: id
      }
    });
    dialog.afterClosed().subscribe((result: any) => {
      this.api.deleteUser(id).subscribe((res: any) => {
        if (res.code == 200) {
          this.snackbar(res.message);
          this.getAllUserData();
        }
        else {
          this.snackbar(res.message);
        }
      });
    });
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

  logout(){
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'view-dialog',
  templateUrl: './view-dialog.html',
})
export class ViewDialog {
  baseUrl = environment.baseUrl;
  constructor(private sanitizer: DomSanitizer, @Inject(MAT_DIALOG_DATA) public data: any) { }
  getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.html',
})
export class DeleteDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteDialog>) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
