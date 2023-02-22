import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';


@Component({
  selector: 'app-show-user',
  templateUrl: './show-user.component.html',
  styleUrls: ['./show-user.component.css']
})
export class ShowUserComponent implements OnInit {

  constructor(private service:SharedService) { }

  UserList:any = [];

  ngOnInit(): void {
    this.refreshUserList();
  }
  
  refreshUserList(){
    this.service.getUserList().subscribe(data=>
      {
        this.UserList=data;
      })
  }
  
}
