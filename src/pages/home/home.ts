import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }
  
  onAddPlace(){
      this.navCtrl.push(AddPlacePage);
  }
}
