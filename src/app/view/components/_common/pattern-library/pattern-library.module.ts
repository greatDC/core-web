import { CommonModule } from '@angular/common';
import { NGFACES_MODULES } from '../../../../modules';
import { NgModule } from '@angular/core';
import { PatternLibraryComponent } from './pattern-library.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DotIconButtonModule } from '../dot-icon-button/dot-icon-button.module';
import { MultiSelectModule, InputSwitchModule } from 'primeng/primeng';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { ListingDataTableModule } from '@components/listing-data-table/listing-data-table.module';
import { TableModule } from 'primeng/table';

const routes: Routes = [
    {
        component: PatternLibraryComponent,
        path: ''
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ...NGFACES_MODULES,
        RouterModule.forChild(routes),
        DotIconButtonModule,
        DotDialogModule,
        MultiSelectModule,
        TableModule,
        InputSwitchModule,
        ListingDataTableModule
    ],
    declarations: [PatternLibraryComponent]
})
export class PatternLibraryModule {}
