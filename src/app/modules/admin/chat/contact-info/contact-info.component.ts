import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from '../chat.types';

@Component({
    selector: 'chat-contact-info',
    templateUrl: './contact-info.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
})
export class ContactInfoComponent {
    @Input() chat: Chat;
    @Input() drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor() {}
}
