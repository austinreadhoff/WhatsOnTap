import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SettingService } from '../services/setting.service';
import { Global } from '../shared/global';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loadingState: boolean;
  formFields: object;

  constructor(public snackBar: MatSnackBar, private _settingService: SettingService) { }

  ngOnInit() {
    this.formFields = {};
    this.loadingState = true;
    this.loadSettings();
  }

  loadSettings(){
    this._settingService.getAllSettings(Global.BASE_SETTING_ENDPOINT)
      .subscribe(settings =>{
        this.loadingState = false;
        settings.forEach(setting => {
          this.formFields[setting.key] = setting;
        });
      });
  }

  updateSetting(settingObj, value){
    if (settingObj[settingObj.type + "Value"] != value){
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
}
