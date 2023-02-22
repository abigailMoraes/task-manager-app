import { EventColor } from "calendar-utils";

export class Task{
            id?:string | number;
            title:string;
            taskdescription?:string;
            start:Date;
            end?:Date;
            deadline?:Date;
            completed?:boolean;
            repeating:string;
            scheduled:boolean;
            progress:number;
            hours?:number;
            priority:string;
            allDay?:boolean;
            color?:EventColor;
            draggable?:boolean;
            username?:string;
            resizable?: {
                beforeStart?: boolean;
                afterEnd?: boolean;
            };
}