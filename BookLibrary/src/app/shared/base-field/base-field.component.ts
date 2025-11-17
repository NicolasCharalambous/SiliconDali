import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
    selector: 'base-field, [base-field]',
    templateUrl: './base-field.component.html',
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class BaseFieldComponent implements OnInit {
    @ViewChild('headerLabel') headerLabel: any;
    @ViewChild('fieldDiv') fieldDiv: any;
    @ViewChild('errorsDiv') errorsDiv: any;
    @Input() header?: string;
    @Input() control!: AbstractControl | null;
    @Input() for?: string;

    constructor() {}

    get showRequiredErrors(): boolean | undefined {
        return this._shouldDisplayErrors();
    }

    get showPatternErrors(): boolean | undefined {
        return this._shouldDisplayPatternErrors();
    }

    ngOnInit(): void {
        if (!this.control) throw new Error('Control cannot be null');

        if (this.control.status === 'DISABLED') return;
        this.control.statusChanges.subscribe((val) => {
            this._shouldDisplayErrors();
        })
    }

    private _shouldDisplayErrors() {
        let showErrors = this.control?.touched && this.control?.dirty && this.control?.invalid && this.control?.errors?.['required'];

        if (showErrors === undefined) showErrors = false;

        this._addOrRemoveErrorClass(showErrors);

        return showErrors;
    }

    private _shouldDisplayPatternErrors() {
        let showErrors = this.control?.touched && this.control?.dirty && this.control?.invalid && this.control?.errors?.['pattern'];

        if (showErrors === undefined) showErrors = false;

        this._addOrRemoveErrorClass(showErrors);

        return showErrors;
    }

    private _addOrRemoveErrorClass(showErrors: boolean) {
        if (showErrors) {
            this.fieldDiv?.nativeElement.classList.add('has-error');
            this.headerLabel?.nativeElement.classList.add('has-error');
        } else {            
            this.fieldDiv?.nativeElement.classList.remove('has-error');
            this.headerLabel?.nativeElement.classList.remove('has-error');
        }
    }
}