import React from "react";
import { Button,View,Text,Image,Platform } from "react-native";
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class Click extends React.Component
{
    state={
        image:null
    }
    componentDidMount(){
        this.getPermission()
    }
    render(){
        let {img}=this.state
        return(
            <View>
                <Button title="press" onPress={this.Click}/>
            </View>
        )

    }
    getPermission=async()=>{
        if ( Platform.OS!=="web"){
            const {status}=await Permissions.askAsync(Permissions.CAMERA_ROW)
            if (status!=="granted"){
                alert(" Unable to access the gallery. Please take permissions")
            }
        }
    }
   uploadImage=async(uri)=>{
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const file ={uri:uri,name:filename,type:type}
        data.append("digit",file)
        fetch("https://f292a3137990.ngrok.io/predict-digit", {
             method: "POST", 
             body: data,
             headers: { "content-type": "multipart/form-data", }, })
             .then(response=>response.json())
             .then(result=>console.log("success",result))
             .catch(error=>console.log("error",error))
    }
    pickImage=async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({ 
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true, 
            aspect: [4, 3], 
            quality: 1, });
            if(!result.cancelled)
            {
                this.setState({image:result.data})
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(error){
            console.log(error)
        }
    }
}
