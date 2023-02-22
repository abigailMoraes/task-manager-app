import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '@auth0/auth0-angular';

import { UserComponent } from './user.component';
import { ShowUserComponent} from './show-user/show-user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserComponent , ShowUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
