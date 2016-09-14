import {Component, ViewEncapsulation} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';

// Custom Components
import {DropdownComponent} from "../dropdown-component/dropdown-component";
import {GlobalSearch} from '../global-search/global-search';
import {MainNavigation} from '../main-navigation/main-navigation';
import {SiteSelectorComponent} from '../../site-selector/dot-site-selector-component';
import {ToolbarNotifications} from '../toolbar-notifications/toolbar-notifications';
import {ToolbarUserComponent} from "../toolbar-user/toolbar-user";

// Angular Material
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import {MdButton} from '@angular2-material/button/button';
import {MdIcon} from '@angular2-material/icon/icon';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';

@Component({
    directives: [MdToolbar, MD_SIDENAV_DIRECTIVES, MD_INPUT_DIRECTIVES, FORM_DIRECTIVES, MdButton, MdIcon,
        GlobalSearch, MainNavigation, ToolbarNotifications, SiteSelectorComponent, ToolbarUserComponent,
        DropdownComponent],
    encapsulation: ViewEncapsulation.Emulated,
    moduleId: __moduleName, // REQUIRED to use relative path in styleUrls
    providers: [],
    selector: 'dot-main-component',
    styleUrls: ['main-component.css'],
    templateUrl: ['main-component.html'],
})
export class MainComponent {

    constructor() {
    }

    ngOnInit() {
        document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = '';
    }

    setGlobalLang(): void {
        // TODO: this strings of date information will come from the rest API base on user language.
        this.formatDate.setLang('es', {
            relativeTime : {
                d : 'un jour',
                dd : '%d jours',
                future : 'dans %s',
                h : 'une heure',
                hh : '%d heures',
                M : 'un mois',
                m : 'une minute',
                mm : '%d minutes',
                MM : '%d mois',
                past : 'il y a %s',
                s : 'quelques secondes',
                y : 'une année',
                yy : '%d années'
            },
        })
    }
}