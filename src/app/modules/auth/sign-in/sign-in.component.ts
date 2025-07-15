import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { DataGuardService } from 'app/core/auth/data.guard';
import { SignalRService } from 'app/modules/admin/common/signalr.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        CommonModule
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    currentYear: number = new Date().getFullYear();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _signalRService: SignalRService,
        private _formBuilder: UntypedFormBuilder,
        private dataService: DataGuardService,
        private _router: Router
    ) {
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        var request = {
            Email: this.signInForm.get('email').value,
            Password: this.signInForm.get('password').value
        };
        // Sign in
        this._authService.signInWithPassword(request).subscribe(
            (response) => {
                if (response.token) {
                    // if(response.Data.RoleID===3){
                    // const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    // this._router.navigateByUrl(redirectURL);
                    if (response) {
                        this.dataService.setLocalData('accessToken', response.token);
                        this.dataService.setLocalData('refreshToken', response.refreshToken);
                        
                        let token = this.dataService.getLocalData('accessToken');
                        //  Connect SignalR once globally
                        if(token){
                            this._signalRService.connect();
                        }
                        this._router.navigate(['/dashboard']);
                    }
                    // }
                    else {
                        this.signInForm.enable();

                        // Reset the form
                        this.signInNgForm.resetForm();

                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: 'You Dont Have Access'
                        };

                        // Show the alert
                        this.showAlert = true;
                    }
                }


            }, (error) => {
                this.signInForm.enable();

                        // Reset the form
                        this.signInNgForm.resetForm();
                this.showAlert = true;
                
                this.alert = {
                    type: 'error',
                    message: error.error.exception
                };
            })
    }
    
}
