import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RankingsPage } from './rankings.page';

describe('RankingsPage', () => {
  let component: RankingsPage;
  let fixture: ComponentFixture<RankingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RankingsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RankingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
