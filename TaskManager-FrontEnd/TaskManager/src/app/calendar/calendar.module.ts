import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DemoComponent } from './calendar.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Task } from '../task/task';
import { MatDateFormats } from '@angular/material/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import {NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import { AppModule } from '../app.module';
import { SvgbarComponent } from './svgbar/svgbar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';




@NgModule({
    declarations: [DemoComponent, SvgbarComponent],
    exports: [DemoComponent, NgxMatDatetimePickerModule],
    imports: [
        CommonModule,
        FormsModule,
        NgbModalModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatInputModule,
        MatDatepickerModule,
        NgxMatNativeDateModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatTabsModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
    ]
})
export class DemoModule {}
