import { SharedService } from 'src/app/shared.service';
import { Input, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Task } from '../task/task';
import { NgxMatTimepickerComponent } from '@angular-material-components/datetime-picker';
import { NgxMatDateFormats } from '@angular-material-components/datetime-picker';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';
import { AfterViewChecked } from '@angular/core';



import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  isThisWeek,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { validateEvents } from 'angular-calendar/modules/common/util';
import { id } from 'date-fns/locale';
import { UserInfoComponent } from '../user-info/user-info.component';
import { AddEditUserComponent } from '../user/add-edit-user/add-edit-user.component';
import { Obj } from '@popperjs/core';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
        h3 {
          margin: 0 0 10px;
        }
  
        pre {
          background-color: #f5f5f5;
          padding: 15px;
        }
      `,
  ],
  templateUrl: 'calendar.component.html',
})
export class DemoComponent implements OnInit, AfterViewInit {

  @Input() user!: any;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('taskWindow', { read: ElementRef }) public taskWindow: ElementRef;
  @ViewChildren('events', { read: ElementRef }) eventDivs: QueryList<ElementRef>
  @ViewChildren('tasks', { read: ElementRef }) taskDivs: QueryList<ElementRef>


  name = 'Angular';


  constructor(private modal: NgbModal, private service: SharedService, public auth: AuthService) { }


  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  events: CalendarEvent[];

  eventObjects: any[];

  tasks: Task[];

  scheduledTasks: Task[];

  unscheduledTasks: Task[];

  priority: any[];

  repeated: any[];

  completedTasks: Task[];

  userinfo: UserInfoComponent;

  completedEvents: CalendarEvent[];

  eventIdMap: any;

  taskIdMap: any;


  ngOnInit(): void {
    this.completedEvents = [];
    this.events = [];
    this.tasks = [];
    this.unscheduledTasks = [];
    this.scheduledTasks = []
    console.log(this.user);
    this.addUser(this.user);
    this.getCalendarEvents(this.user.nickname);
    this.getAllTasks(this.user.nickname);
    this.priority = [];
    this.priority.push("Low");
    this.priority.push("Medium");
    this.priority.push("High");
    this.repeated = [];
    this.repeated.push("None");
    this.repeated.push("Daily");
    this.repeated.push("Weekly");
    this.repeated.push("Monthly");
    console.log(this.priority);
    console.log(JSON.stringify(this.user.nickname));
    this.eventIdMap = new Map();
    this.taskIdMap = new Map();

  }
  items: Array<CalendarEvent<{ time: any }>> = [];

  getRepeatedEnum(repeat: any) {
    switch (repeat) {
      case "None": {
        return '0';
      }
      case "Daily": {
        return '1';
      }
      case "Weekly": {
        return '2';

      }
      case "Monthly": {
        return '3';
      }
      default: {
        return '0';
      }
    }
  }

  getRepeated(repeat: any) {
    switch (repeat) {
      case '0': {
        return "None";
      }
      case '1': {
        return "Daily";
      }
      case '2': {
        return "Weekly";

      }
      case '3': {
        return "Monthly";
      }
      default: {
        return "None";
      }
    }
  }

  getPriorityEnum(priority: any) {
    if (priority == "Low") {
      return '0';
    } else if (priority == "Medium") {
      return '1';
    } else {
      return '2';
    }
  }

  getPriority(priority: any) {
    if (priority == '0') {
      return "Low";
    } else if (priority == '1') {
      return "Medium";
    } else {
      return "High";
    }
  }
  addUser(user: any) {
    var found = false;
    console.log(user.nickname);
    this.service.getAllUsers().subscribe(data => {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i]['username']);
        if (JSON.stringify(data[i]['username']) === JSON.stringify(user.nickname)) {
          console.log('found');
          found = true;
        }
      }
    });
    console.log(user.nickname);
    console.log(found);
    if (!!found) {
      var val = {
        username: user.nickname,
        firstname: user.given_name,
        lastname: user.family_name,
        email: user.email,
        phone: "not provided"
      };
      this.service.addUser(val).subscribe(res => { alert(res.toString()); });
    }

  }

  loopThroughEvents(res: string | any[]) {
    var obj: Array<any> = [];
    for (var i = 0; i < res.length; i++) {

      var event: Object = {
        id: res[i]['eventID'],
        parentTaskID: res[i]['parentTaskID'],
        userid: res[i]['username_id'],
        title: res[i]['title'],
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
        repeating: res[i]['repeating'],
        start: new Date(res[i]['start']),
        end: new Date(res[i]['end']),
        completed: res[i]['completed']
      }
      this.eventIdMap.set(res[i]['eventID'], event);
      obj.push(event)
    }

    this.events = obj;
    console.log(this.events);
    this.eventObjects = obj;
    console.log(this.eventObjects);
    this.refresh.next();
  }

  getCalendarEvents(id: any) {
    return this.service.getEventList(id)
      .subscribe(data => {
        this.loopThroughEvents(data);
      })
  }

  loopThroughTasks(res: string | any[]) {
    var obj: Array<any> = [];
    for (var i = 0; i < res.length; i++) {
      var p = this.getPriority(res[i]['priority']);
      var r = this.getRepeated(res[i]['repeating']);
      console.log(p);
      console.log(res[i]['priority']);
      var task: Object = {
        id: res[i]['taskID'],
        userid: res[i]['username_id'],
        title: res[i]['title'],
        description: res[i]['taskdescription'],
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
        repeating: r,
        start: new Date(res[i]['start']),
        end: new Date(res[i]['end']),
        deadline: new Date(res[i]['deadline']),
        completed: res[i]['completed'],
        progress: 0,
        hours: res[i]['hours'],
        priority: p,
        allDay: res[i]['allDay'],
        scheduled: res[i]['scheduled'],
      }
      this.taskIdMap.set(res[i]['taskID'], task);
      obj.push(task)
    }
    console.log(obj);
    this.tasks = obj;
    console.log(this.tasks);
    this.unscheduledTasks = this.tasks.filter((ut) => (ut.completed === false && ut.scheduled === false));
    this.completedTasks = this.tasks.filter((ct) => ct.completed === true);
    this.scheduledTasks = this.tasks.filter((st) => st.scheduled === true);
    console.log(this.scheduledTasks);
    if (this.scheduleTasks.length > 0) {
      this.scheduledTasks.forEach((st) => {
        this.CalculateProgress(st);
      });
    }
    console.log(this.tasks);
    console.log(this.unscheduledTasks);
    console.log(this.scheduledTasks);
    this.refresh.next();
  }

  CalculateProgress(task: any) {
    console.log(this.eventObjects);
    console.log(task);
    let completedChildEvents = this.eventObjects.filter((event) =>
      (event.parentTaskID == task.id && event.completed == true));

    console.log(completedChildEvents);

    let taskDuration = task.hours;
    let hoursCompleted = 0;

    console.log(taskDuration);

    completedChildEvents.forEach((childEvent) => {
      console.log(childEvent.start.getTime());
      console.log(childEvent.start - childEvent.end);
      let eventDuration = Math.abs(childEvent.start.getHours() - childEvent.end.getHours());
      hoursCompleted += eventDuration
    })

    console.log(hoursCompleted);

    let completion = hoursCompleted / taskDuration * 100;

    console.log(completion);
    task.progress = task.progress + completion;

  }

  getAllTasks(id: any) {
    return this.service.getTaskList(id)
      .subscribe(data => {
        console.log(data);
        this.loopThroughTasks(data);
      })
  }


  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();



  activeDayIsOpen: boolean = true;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    console.log("in add events");
    console.log(this.eventObjects);
    this.eventObjects = [
      ...this.eventObjects,
      {
        id: 0,
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];

    this.events = [
      ...this.events,
      {
        id: 0,
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },

    ]


  }

  ngAfterViewInit() {
    this.eventDivs.changes.subscribe(() => {
      if (this.eventDivs && this.eventDivs.last) {
        this.eventDivs.last.nativeElement.scrollIntoView();
      }
    });
    this.taskDivs.changes.subscribe(() => {
      if (this.taskDivs && this.taskDivs.last) {
        this.taskDivs.last.nativeElement.scrollIntoView();
      }
    });
  }



  saveEvent(eventToSave: any, user: any) {
    var val = {
      "id": eventToSave.id,
      "username": this.user.nickname,
      "title": eventToSave.title,
      "eventdescription": eventToSave.title,
      "parentTaskID": eventToSave.parentTaskID,
      "end": eventToSave.end,
      "start": eventToSave.start,
      "allDay": eventToSave.allDay,
      "color": "colors.red",
      "draggable": eventToSave.draggable
    }
    this.service.addEvent(this.user.nickname, val).subscribe(res => {
      alert(res.toString());
      this.getCalendarEvents(this.user.nickname);
      this.refresh.next();
    });

  }

  updateEvent(eventToUpdate: any, eventId: any) {
    var val = {
      "id": eventToUpdate.id,
      "username": this.user.nickname,
      "title": eventToUpdate.title,
      "eventdescription": eventToUpdate.title,
      "end": eventToUpdate.end,
      "start": eventToUpdate.start,
      "allDay": eventToUpdate.allDay,
      "color": "colors.red",
      "draggable": eventToUpdate.draggable,
      "completed": eventToUpdate.completed
    }
    this.service.updateEventDetails(eventId, val).subscribe(res => { alert(res.toString()); });
  }

  updateEvents(eventsToUpdate: CalendarEvent[]) {
    console.log("in update Events");
    eventsToUpdate.forEach((event: any) => {
      this.updateEvent(event, event.id);

    });
  }

  deleteEvent(eventToDelete: any) {
    var id = String(eventToDelete.id)
    this.service.deleteEvent(id).subscribe(res => { alert(res.toString()); });
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.eventObjects = this.events.filter((event) => event !== eventToDelete);

  }

  addTask(): void {
    this.unscheduledTasks = [
      ...this.unscheduledTasks,
      {
        id: 0,
        title: 'New task',
        taskdescription: 'details',
        deadline: endOfDay(new Date()),
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        hours: 1,
        priority: "Low",
        repeating: "0",
        scheduled: false,
        completed: false,
        progress: 0,
        allDay: false,
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];


  }

  saveTask(taskToSave: Task, user: any) {
    var p = this.getPriorityEnum(taskToSave.priority);
    var r = this.getRepeatedEnum(taskToSave.repeating);
    console.log(p);
    console.log("tasktoSavepriority");
    console.log(taskToSave.priority);
    console.log(taskToSave.scheduled);
    var val = {
      "taskID": taskToSave.id,
      "title": taskToSave.title,
      "taskdescription": taskToSave.taskdescription,
      "start": taskToSave.start,
      "end": taskToSave.end,
      "deadline": taskToSave.deadline,
      "completed": taskToSave.completed,
      "repeating": r,
      "hours": taskToSave.hours,
      "priority": p,
      "allDay": taskToSave.allDay,
      "color": "colors.red",
      "draggable": taskToSave.draggable,
      "username": this.user.nickname,
      "scheduled": false,
    }
    this.service.addTask(this.user.nickname, val).subscribe(res => {
      alert(res.toString());
      this.getAllTasks(this.user.nickname);
      this.refresh.next();
    });

  }

  updateTask(taskToUpdate: Task, taskId: any) {
    var p = this.getPriorityEnum(taskToUpdate.priority);
    var r = this.getRepeatedEnum(taskToUpdate.repeating);
    console.log("tasktoUpdatepriority");
    console.log(taskToUpdate.priority);
    var val = {
      "id": taskId,
      "title": taskToUpdate.title,
      "taskdescription": taskToUpdate.title,
      "start": taskToUpdate.start,
      "end": taskToUpdate.end,
      "deadline": taskToUpdate.deadline,
      "completed": taskToUpdate.completed,
      "repeating": r,
      "hours": taskToUpdate.hours,
      "priority": p,
      "allDay": taskToUpdate.allDay,
      "color": "colors.blue",
      "draggable": taskToUpdate.draggable,
      "username": this.user.nickname,
      "scheduled": taskToUpdate.scheduled,
    }
    this.service.updateTaskDetails(taskId, val).subscribe(res => {
      alert(res.toString());
    });
  }

  scheduleTask(taskToUpdate: Task, taskId: any) {
    var p = this.getPriorityEnum(taskToUpdate.priority);
    var r = this.getRepeatedEnum(taskToUpdate.repeating);
    console.log("tasktoUpdatepriority");
    console.log(taskToUpdate.priority);
    var val = {
      "id": taskId,
      "title": taskToUpdate.title,
      "taskdescription": taskToUpdate.title,
      "start": taskToUpdate.start,
      "end": taskToUpdate.end,
      "deadline": taskToUpdate.deadline,
      "completed": taskToUpdate.completed,
      "repeating": r,
      "hours": taskToUpdate.hours,
      "priority": p,
      "allDay": taskToUpdate.allDay,
      "color": "colors.blue",
      "draggable": taskToUpdate.draggable,
      "username": this.user.nickname,
      "scheduled": taskToUpdate.scheduled,
    }

    this.service.updateTaskDetails(taskId, val).subscribe(res => {
      alert(res.toString());
      this.scheduledTasks.push(taskToUpdate);
      this.getAllTasks(this.user.nickname);
      this.refresh.next();
    });
  }

  updateTasks(taskstoUpdate: Task[]) {
    taskstoUpdate.forEach((task: any) => {
      this.updateTask(task, task.id);
    });
  }




  deleteTask(taskToDelete: Task) {
    var id = String(taskToDelete.id)
    this.service.deleteTask(id).subscribe(res => { alert(res.toString()); });
    this.getAllTasks(this.user.nickname);
    this.getCalendarEvents(this.user.nickname);
    this.refresh.next();

  }

  completeTask(taskToUpdate: Task, taskId: any) {
    let p = this.getPriorityEnum(taskToUpdate.priority);
    var r = this.getRepeatedEnum(taskToUpdate.repeating);
    var val = {
      "id": taskId,
      "title": taskToUpdate.title,
      "taskdescription": taskToUpdate.title,
      "start": taskToUpdate.start,
      "end": taskToUpdate.end,
      "deadline": taskToUpdate.deadline,
      "completed": true,
      "repeating": r,
      "hours": taskToUpdate.hours,
      "priority": p,
      "allDay": taskToUpdate.allDay,
      "color": "colors.blue",
      "draggable": taskToUpdate.draggable,
      "username": this.user.nickname,
    }
    this.service.updateTaskDetails(taskId, val).subscribe(res => { alert(res.toString()); });
    this.completedTasks.push(taskToUpdate);
    this.tasks = this.tasks.filter((task) => task !== taskToUpdate);
  }

  completeEvent(eventToComplete: any, eventId: any) {
    var val = {
      "id": eventId,
      "username": this.user.nickname,
      "parentTaskID": eventToComplete.parentTaskID,
      "title": eventToComplete.title,
      "eventdescription": eventToComplete.title,
      "end": eventToComplete.end,
      "start": eventToComplete.start,
      "allDay": eventToComplete.allDay,
      "color": "colors.red",
      "draggable": eventToComplete.draggable,
      "completed": true,
    }
    this.events = this.events.filter((event) => event.id !== eventToComplete.id);
    this.eventObjects = this.eventObjects.filter((eventObject) => eventObject.id !== eventToComplete.id);
    this.service.updateEventDetails(eventId, val).subscribe(res => {
      alert(res.toString());
      console.log(eventToComplete)
      this.completedEvents.push(eventToComplete);

      if (eventToComplete.parentTaskID != 0) {
        var eventDuration = Math.abs(eventToComplete.start.getHours() - eventToComplete.end.getHours())

        var parentTask;
        this.tasks.forEach((task) => {
          if (task.id == eventToComplete.parentTaskID) {
            parentTask = task;
            parentTask.progress = parentTask.progress + ((eventDuration / task.hours) * 100);
            this.updateTask(parentTask, parentTask.id);
          }
        });
      }
    });

  }

  scheduleTasks(eventsScheduled: CalendarEvent[], tasksScheduled: Task[]) {
    this.getAllTasks(this.user.nickname);
    console.log(tasksScheduled);
    let currentTime = new Date().getTime();
    console.log(this.scheduledTasks);
    console.log(this.tasks);
    // adding 2 hours to current time for t0 which is the initial date-time pointer
    let t0 = new Date(currentTime);
    if (eventsScheduled.length != 0) {
      // filter events that ended before T0
      eventsScheduled.filter((event) => !(event.end.getTime() < t0.getTime()));
      //order events by start time
      eventsScheduled.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
    let eventPointer = 0; // start events at the top of the eventsQueue
    //filter tasks where the deadline ended before T0
    let q1 = this.unscheduledTasks;
    console.log(q1);
    q1.filter((task) => task.completed == false);
    console.log(q1);
    q1.filter((task) => task.scheduled == false);
    console.log(q1);
    q1.filter((task) => task.deadline.getTime() < t0.getTime());
    // create two task queues to process tasks one contains the task and the other is empty
    console.log("sorting by deadline, then priority, then hours");
    q1.sort((a, b) => a.deadline.getTime() - b.deadline.getTime() || parseInt(this.getPriorityEnum(b.priority)) - parseInt(this.getPriorityEnum(a.priority))
      || a.hours - b.hours);
    let newEvents = [];

    let q2 = [];
    let t1;
    let prevEvent;
    // initialize t1 at the start time of the first event in the array and increment event pointer
    if (eventsScheduled.length != 0) {
      t1 = eventsScheduled[eventPointer].start;
      prevEvent = eventsScheduled[eventPointer++];
      let diffMs = t1.getTime() - t0.getTime();
      let currTimeSlot = Math.floor((diffMs%86400000)/3600000);
      // with event interference
      while (eventPointer < eventsScheduled.length && q1 && currTimeSlot > 0) {
        let flagTaskScheduled = 0;
        while (q1) {
          let currTask = q1.pop();
          if (currTask.hours < currTimeSlot) {
            q2.push(currTask);
          } else {
            let s = t0;
            let e = new Date(t0.getTime() + currTask.hours);
            t0 = e;
            diffMs = t1.getTime() - t0.getTime();
            currTimeSlot = Math.floor((diffMs%86400000)/3600000);
            let val = {
              "id": currTask.id,
              "parentTaskID": currTask.id,
              "username": this.user.nickname,
              "title": currTask.title,
              "eventdescription": currTask.title,
              "end": e,
              "start": s,
              "allDay": currTask.allDay,
              "color": colors.red,
              "draggable": currTask.draggable,
              "completed": false
            }
            let evObj = {
              "id": currTask.id,
              "parentTaskID": currTask.id,
              "username": this.user.nickname,
              "title": currTask.title,
              "eventdescription": currTask.title,
              "end": e,
              "start": s,
              "allDay": currTask.allDay,
              "color": colors.red,
              "draggable": currTask.draggable,
              "completed": false,
              "progress": 0,
            }
            this.eventObjects.push(evObj);
            newEvents.push(val);
            this.scheduleTask(currTask, currTask.id);
            flagTaskScheduled = 1;
          }
        }
        if (flagTaskScheduled === 0) {
          t0 = prevEvent.end;
        }
        t1 = eventsScheduled[eventPointer++].start;
        q1 = q2;
        diffMs = t1.getTime() - t0.getTime();
        currTimeSlot = Math.floor((diffMs%86400000)/3600000);
      }
    }
    console.log("no more events back to regular scheduling");
    console.log(q1);
    while (q1) {
      let currTask = q1.pop();
      let start = t0
      let end = new Date(t0.getTime() + currTask.hours * 60 * 60 * 1000);
      let val = {
        "id": currTask.id,
        "parentTaskID": currTask.id,
        "username": this.user.nickname,
        "title": currTask.title,
        "eventdescription": currTask.title,
        "end": end,
        "start": start,
        "allDay": currTask.allDay,
        "color": colors.red,
        "draggable": currTask.draggable,
        "completed": false,
      }
      let evObj = {
        "id": currTask.id,
        "parentTaskID": currTask.id,
        "username": this.user.nickname,
        "title": currTask.title,
        "eventdescription": currTask.title,
        "end": end,
        "start": start,
        "allDay": currTask.allDay,
        "color": colors.red,
        "draggable": currTask.draggable,
        "completed": false,
        "progress": 0,
      }
      currTask.scheduled = true;
      this.scheduleTask(currTask, currTask.id);
      console.log(this.scheduledTasks);
      this.eventObjects.push(evObj);
      //this.events.push(val);
      //newEvents.push(val);
      this.saveEvent(val, this.user);
      t0 = end;
    }
    this.getCalendarEvents(this.user.nickname);
    this.getAllTasks(this.user.nickname);
    this.refresh.next();
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


}
