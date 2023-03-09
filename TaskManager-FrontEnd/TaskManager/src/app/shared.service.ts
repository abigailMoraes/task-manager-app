import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map} from 'rxjs';
import { CalendarEvent} from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  
//readonly APIUrl = "http://127.0.0.1:8000";
//readonly APIUrl = "http://54.157.131.72:8000";
//readonly APIUrl = "https://ec2-54-157-131-72.compute-1.amazonaws.com";
readonly APIUrl = "http://127.0.0.1:80";
//readonly APIUrl = "https://taskmanagerheroku-app.herokuapp.com";
  
  constructor(private http:HttpClient) { }
  
  getUserList():Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/user/');
  }
  
  addUser(val:any){
    console.log('attempting to add user');
    console.log(this.APIUrl + '/user/'+ val);
    return this.http.post(this.APIUrl + '/user/', val);
  }

  updateUserDetails(val:any){
    return this.http.put(this.APIUrl + '/user/', val);
  }

  deleteUser(val:any){
    return this.http.delete(this.APIUrl + '/user/'+val);
  }

  getAllUsers():Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl+'/user/');
  }

  getEventList(userID:any):Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/events/'+ userID);
  }
  
  addEvent(userID:any, val:any){
    return this.http.post(this.APIUrl + '/event/'+ userID, val);
  }

  updateEventDetails(eventID:any, val:any){
    return this.http.put(this.APIUrl + '/event/'+ eventID, val);
  }

  deleteEvent(val:any){
    return this.http.delete(this.APIUrl + '/event/' + val);
  }

  getAllEvents():Observable<CalendarEvent[]>{
    return this.http.get<any[]>(this.APIUrl+'/event/');
  }

  getTaskList(userID:any):Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/tasks/'+ userID);
  }
  
  addTask(userID:any, val:any){
    return this.http.post(this.APIUrl + '/task/'+ userID, val);
  }

  updateTaskDetails(taskID:any, val:any){
    return this.http.put(this.APIUrl + '/task/'+ taskID, val);
  }

  deleteTask(val:any){
    return this.http.delete(this.APIUrl + '/task/' + val);
  }

  getAllTasks():Observable<CalendarEvent[]>{
    return this.http.get<any[]>(this.APIUrl+'/task/');
  }

  
}
