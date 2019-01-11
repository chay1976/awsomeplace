import { Place } from "../models/place";
import { Location } from "../models/location";
import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage";
import { File } from "@ionic-native/file";

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
                        ()=>{
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
                if (place.imageUrl!==''){
                    this.removeFile(place);
                }
            })
            .catch((err)=>console.log(err.message));
    }

    getDataUrl(index: number){
        this.file.readAsDataURL(this.file.dataDirectory,this.places[index].imageUrl)
            .then((res)=>{return res});
    }
    private removeFile(place: Place){
        this.file.removeFile(this.file.dataDirectory,place.imageUrl)
            .then(()=>alert('removed file'))
            .catch((err)=>{
                alert(err.message);
                alert(place.imageUrl);
                this.addPlace(place.title,place.description,place.location,place.imageUrl);
            });
    }

    listAll(){
        this.file.listDir(this.file.dataDirectory,'files')
            .then((files)=>{
                for (let file of files){
                    alert(file.name);
                    // if (file.name.includes(".jpg")){
                    //     file.remove(()=>{
                    //         alert("delete"+file.name);
                    //     },(err)=>{alert(err.message)});
                    // }
                }
            })
            .catch();
    }
}