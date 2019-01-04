import { Component, OnInit } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';

import { Location } from '../../models/location';
import { SetLocationPage } from '../set-location/set-location';

/**
 * Generated class for the AddPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage implements OnInit {
  location: Location={
    lat: 40.7624324,
    lng: -73.9759827
  }
  locationIsSet=false;
  imageUrl="";
  hasCordova=false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private geolocation: Geolocation,
              private platform: Platform
              ) {
         
              }
  ngOnInit(){
    
    // navigator.mediaDevices.enumerateDevices()
    // .then(gotMedias=>{
    //   gotMedias.forEach((element)=>{
    //     console.log(element.kind);
    //     if (element.kind=='videoinput'){
    //       this.cameraFound=true;
    //     }
    //   });
    //   console.log(this.cameraFound);
    // })
    // .catch();
    if (this.platform.is('cordova')){
      this.hasCordova=true;
    }
  }
  ionViewDidLoad() {
       
    // const video=<HTMLMediaElement>document.getElementById('video');
    
    // navigator.mediaDevices.getUserMedia({
    //   audio: false,
    //   video: true
    // })
    //   .then(
    //     stream=>{
    //       video.srcObject=stream;
    //     }
    //   )
    //   .catch(console.error);
  }

  onSubmit(form: NgForm){
  }

  onOpenMap(){
    const modal=this.modalCtrl.create(SetLocationPage, {
      location: this.location,
      isSet: this.locationIsSet,
    });
    modal.present();
    modal.onDidDismiss(
      data=>{
        if(data){
          this.location=data.location;
          this.locationIsSet=true;
        }
      }
    );
  }

  onLocate(){
    const loader=this.loadingCtrl.create({
      content:'Getting your Location...'
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then(
        (resp)=>{
          this.location.lat=resp.coords.latitude;
          this.location.lng=resp.coords.longitude;
          this.locationIsSet=true;
          loader.dismiss();
          console.log(resp);
        }
      )
      .catch(
        (error)=>{
          loader.dismiss();
          const toast=this.toastCtrl.create({
            message: error.message,
            duration: 2500
          });
          toast.present();
        }
      );
  }

  onTakePhoto(){
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        (imageData)=>{
          console.log(imageData);
        }
      )
      .catch(
        (err)=>{
          console.log(err);
        }
      );
  }
}
