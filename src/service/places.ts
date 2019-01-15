import { Place } from "../models/place";
import { Location } from "../models/location";
import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage";
import { File } from "@ionic-native/file";

@Injectable()
export class PlacesService {
    private places: Place[]=[];
    public dataUrl: string[]=[];
    public length: number;
    constructor(private storage: NativeStorage,
                private file: File){
    }
    
    addPlace(title: string, 
            description: string,
            location: Location,
            imageUrl: string){
                const place = new Place(title, description, location, imageUrl);
                this.places.push(place);
                this.file.readAsDataURL(this.file.dataDirectory,place.imageUrl)
                .then(res=>this.dataUrl.push(res));               
                this.storage.setItem('places', this.places)
                    .then()
                    .catch(
                        ()=>{
                            this.places.splice(this.places.indexOf(place),1);
                        }
                    );
            }

    loadPlaces(){
        this.fetchPlaces();
        this.length=this.places.length;
        this.places.forEach(place=>{
            this.file.readAsDataURL(this.file.dataDirectory,place.imageUrl)
                .then(res=>this.dataUrl.push(res));
        });
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
            .catch(err=>alert("002:"+err.message));
    }

    deletePlace(index: number){
        const place=this.places[index];
        this.places.splice(index,1);
        this.dataUrl.splice(index,1);
        this.storage.setItem('places', this.places)
            .then(()=>{
                if (place.imageUrl!==''){
                    this.removeFile(place);
                }
            })
            .catch(err=>alert(err.message));
    }

    private removeFile(place: Place){
        this.file.removeFile(this.file.dataDirectory,place.imageUrl)
            .then(()=>alert(place.imageUrl+' removed'))
            .catch((err)=>{
                alert("004:"+err.message);
                alert("005:"+place.imageUrl);
            });
    }

    listAll(){
        let fileList: string[]=[];
        return this.file.listDir(this.file.dataDirectory,'files')
            .then((files)=>{
                for (let file of files){
                    if (file.name.includes(".jpg")){
                        fileList.push(file.name);
                        // file.remove(()=>{
                        //     alert("delete"+file.name);
                        // },(err)=>{alert(err.message)});
                    }
                }
                return fileList;
            })
            .catch(err=>alert("006:"+err.message));
    }
}