import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    constructor(private _snack: MatSnackBar) {}

    showToast(isError: boolean, message: string) {
        this._snack.open(message, 'Close', {
          duration: 3000,
          panelClass: [isError ? 'toast-error' : 'toast-success'],
        });
    }
}