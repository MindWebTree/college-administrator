import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable()
export class CoundownSplashScreenService
{
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: any,
        private _router: Router
    )
    {
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the splash screen
     */
    show(): void
    {
        this._document.body.classList.remove('countdown-loading-bar-hidden');
    }

    /**
     * Hide the splash screen
     */
    hide(): void
    {
        this._document.body.classList.add('countdown-loading-bar-hidden');
    }
}
