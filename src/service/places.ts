import { Place } from "../models/place";
import { Location } from "../models/location";
import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage";
import { File } from "@ionic-native/file";

declare var cordova: any;
@Injectable()
export class PlacesService {
    private places: Place[]=[];

    constructor(private storage: NativeStorage,
                private file: File){

    }
    addPlace(title: string, 
            description: string,
            location: Location,
            imageUrl: string){
                const place = new Place(title, description, location, imageUrl);
                this.places.push(place);
                this.storage.setItem('places', this.places)
                    .then()
                    .catch(
                        err=>{
                            this.places.splice(this.places.indexOf(place),1);
                        }
                    );
            }

    loadPlaces(){
        this.fetchPlaces()
        return this.places.slice();
    }

    fetchPlaces(){
        return this.storage.getItem('places')
            .then(
                (places: Place[])=>{
                    this.places=places!=null?places:[];
                    return this.places;
                }
            )
            .catch(
                err=>console.log(err)
            );
    }

    deletePlace(index: number){
        const place=this.places[index];
        this.places.splice(index,1);
        this.storage.setItem('places', this.places)
            .then(()=>{
                this.removeFile(place);
            })
            .catch((err)=>console.log(err));
    }

    private removeFile(place: Place){
        const currentName=place.imageUrl.replace(/^.*[\\\/]/,'');
        this.file.removeFile(cordova.file.dataDirectory,currentName)
            .then(()=>console.log('removed file'))
            .catch(()=>{
                console.log('Error while removing File');
                this.addPlace(place.title,place.description,place.location,place.imageUrl);
            });
    }
}