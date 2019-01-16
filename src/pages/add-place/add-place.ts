import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController, Navbar } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { Location } from '../../models/location';
import { SetLocationPage } from '../set-location/set-location';
import { PlacesService } from '../../service/places';

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
  @ViewChild(Navbar) navbar: Navbar;

  location: Location={
    lat: 40.7624324,
    lng: -73.9759827
  }
  locationIsSet=false;
  imageDataUrl="";
  imageUrl=""
  hasCordova=false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private geolocation: Geolocation,
              private platform: Platform,
              private placesService: PlacesService,
              private file: File
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

    this.navbar.setBackButtonText('Back');
  // this.viewCtrl.setBackButtonText('Back');
  }

  onSubmit(form: NgForm){
    this.placesService.addPlace(form.value.title,form.value.description,this.location,this.imageUrl);
    form.reset();
    this.location={
      lat: 40.7624324,
      lng: -73.9759827
    }
    this.locationIsSet=false;
    this.imageDataUrl="";
    this.imageUrl=""
    this.hasCordova=false;    
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
            duration: 5000
          });
          toast.present();
        }
      );
  }

  onTakePhoto(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        (imageData)=>{
          const currentName=imageData.substring(imageData.lastIndexOf('/')+1);
          const path=imageData.substring(0,imageData.lastIndexOf('/')+1);
          const newFileName = new Date().getUTCMilliseconds() + '.jpg';
          this.file.moveFile(path,currentName,this.file.dataDirectory,newFileName)
            .then(()=>{
              this.file.readAsDataURL(this.file.dataDirectory,newFileName)
                .then((res)=>{
                  this.imageDataUrl=res;
                  this.imageUrl=newFileName;
                });
              this.camera.cleanup();
              this.file.removeFile(path,currentName);
            })
            .catch(err=>{
              const toast=this.toastCtrl.create({
                message: err,
                duration: 2500
              });
              toast.present();
              this.camera.cleanup();
              this.imageDataUrl='';
              this.imageUrl='';
              this.file.removeFile(path,currentName);
            });
        }
      )
      .catch(
        (err)=>{
          const toast=this.toastCtrl.create({
            message: err,
            duration: 2500
          });
          toast.present();
          this.camera.cleanup();
          this.imageUrl='';
          this.imageDataUrl='';
        }
      );
  }

  onFileSelected(){
    const i=<HTMLInputElement>document.getElementById("file-upload");
  }
}
