import { Component, OnInit } from '@angular/core';
import { ISetting } from '../models/setting';
import { MatSnackBar } from '@angular/material';

import { SettingService } from '../services/setting.service';
import { Global } from '../shared/global';

import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loadingState: boolean;
  formFields: object;
  bgPreview: string;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

  constructor(public snackBar: MatSnackBar, private _settingService: SettingService) { }

  ngOnInit() {
    this.formFields = {};
    this.loadingState = true;
    this.loadSettings();

    this.connection.start().catch(err => alert(err));

    this.connection.on("SettingUpdated", (setting) => {
      this.updateBgPreview(setting);
    });
  }

  loadSettings(){
    this._settingService.getAllSettings(Global.BASE_SETTING_ENDPOINT)
      .subscribe(settings =>{
        this.loadingState = false;
        settings.forEach(setting => {
          this.formFields[setting.key] = setting;
        });
        if (this.formFields["MenuBackground"]["byteArrValue"]){
          this.bgPreview = `data:image/${this.formFields["MenuBackground"]["stringValue"]};base64,${this.formFields["MenuBackground"]["byteArrValue"]}`;
        }
        else{
          this.bgPreview = null;
        }
      });
  }

  //settingObj: the formFields object for the setting
  //value: the new value
  //overrideSelfCheck: certain controls bind to their own settingObj, so would otherwise fail the "same value" check and never save
  updateSetting(settingObj, value, overrideSelfCheck=false){
    if (settingObj[settingObj.type + "Value"] != value || overrideSelfCheck){
      settingObj[settingObj.type + "Value"] = value;
      this._settingService.updateSetting(Global.BASE_SETTING_ENDPOINT, settingObj.id, settingObj)
        .subscribe(result =>{
          if (result.message === 'Setting is updated successfully.') {          
            this.showMessage("Update Saved!");
          } else {
            this.showMessage('There is some issue in saving records, please complain to system administrator!');
          }
        });
    }
  }

  toggleLabelUpload(id:string): void{
    var container = document.getElementById(id);
    if (container.classList.contains("upload-container-visible"))
      container.classList.remove("upload-container-visible");
    else{
      container.classList.add("upload-container-visible");
    }
  }

  showMessage(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000
    });
  }

  //signalR functions
  updateBgPreview(setting:ISetting){
    if (setting.key == "MenuBackground" ){
      this.bgPreview = `data:image/${setting.stringValue};base64,${setting.byteArrValue}`;
    }
  }
}
