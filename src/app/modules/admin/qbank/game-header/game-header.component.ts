import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { CommanService } from 'app/modules/common/comman.service';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.scss'
})
export class GameHeaderComponent   implements OnInit {
  LogoUrl: string;
  @Output() dataEvent = new EventEmitter<string>();
  @Input() examid : any;
  @Input() subjectName : any;
  @Input() topicName : any;
  @Input() isfromMarksheet :any=false;
  @Input() hidetraker:any=false;
  constructor(private _CommanService: CommanService,  private _fuseConfigService: FuseConfigService,private dialog: MatDialog,) {
    this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
      this.LogoUrl = TenantInfo.Logo;
      this._fuseConfigService.config = {theme:TenantInfo.ThemeID};
      this._fuseConfigService.config = {scheme:TenantInfo['SchemaID']?.toLowerCase()};
    });
  }
  sendDataToExamView(Data: string) {
    const data = Data;
    this.dataEvent.emit(data);
  }
  ngOnInit(): void {
    this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
      this.LogoUrl = TenantInfo.Logo;
      // this._title.setTitle(TenantInfo.tenantDetails?.Slogan);

  });
  }
  closedialog() {
    this.dialog.closeAll();
    this.dataEvent.emit("leave");
  }
}
