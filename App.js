import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import Tflite from 'tflite-react-native';
import FastImage from 'react-native-fast-image'
import ImageEditor from "@react-native-community/image-editor";
import { RNCamera } from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let tflite_number = new Tflite();
let tflite_counter = new Tflite();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: "",
      filePath2: "",
      filePath3: "",
      sonuc: [],
      sirali_sonuc: [],
      sayac_deger: "-",
      sayac_bolge: [],
      image_size: 1000
    }
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.9, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log("\n\ntakePicture w,h", data.width, data.height);
      // console.log(data.uri);
      this.setState({
        filePath: data.uri
      });
      this.cropImage();
    }
  };

  cropImage = () => {
    cropData = {
      offset: { x: 0, y: 0 },
      size: { width: 3000, height: 3000 },
      displaySize: { width: 3000, height: 3000 },
      resizeMode: 'contain' //'contain' | 'cover' | 'stretch',
    };

    ImageEditor.cropImage(this.state.filePath, cropData).then(url => {
      // console.log("Cropped image uri2", url);
      this.setState({
        filePath2: url
      });
      this.imageResize();
    })
  }

  imageResize = () => {
    ImageResizer.createResizedImage(this.state.filePath2, this.state.image_size, this.state.image_size, 'JPEG', 100, 0, undefined, false)
      .then(resizedImage => {
        // console.log("resizedImage", resizedImage)
        this.setState({
          filePath2: resizedImage.uri
        });
        this.sayacTahminEt();
      })
      .catch(err => {
        console.log(err);

      });
  }

  sayacTahminEt = () => {
    tflite_counter.loadModel({
      model: 'model.tflite',// required
      labels: 'labels.txt',  // required
      numThreads: 1,                              // defaults to 1  
    },
      (err, res) => {
        if (err)
          console.log("tflite_sayac", err);
        else
          console.log("tflite_sayac", res);
      });
    
      
    
    const path = this.state.filePath2
    // console.log("sayacTahminEt path:", path)

    tflite_counter.detectObjectOnImage({
      path: path,
      model: 'SSDMobileNet',
      imageMean: 127.5,
      imageStd: 127.5,
      threshold: 0.1,       // defaults to 0.1
      numResultsPerClass: 5,// defaults to 5
    },
      (err, res) => {
        if (err)
          console.log(err);
        else {

          // console.log("sayac:", res);
          this.setState({
            sayac_bolge:[],
            sayac_deger:""})

          if (res[0].confidenceInClass > 0.2) { // score değeri %20 den büyükse
            this.state.sayac_bolge.push({
              class: res[0].detectedClass,
              score: res[0].confidenceInClass,
              x: res[0].rect.x,
              y: res[0].rect.y,
              w: res[0].rect.w,
              h: res[0].rect.h,
            })

            console.log("\nsayac_bolge:", this.state.sayac_bolge[0]);
            // console.log("y:", parseInt(this.state.sayac_bolge[0].y * this.state.image_size));

            this.cropImage2();
            // this.cropImage2();
          }
          else {
            this.setState({
              sayac_deger: "Plaka Bulunamadı",
              filePath: "",
              filePath2: "",
              filePath3: "",
              // sayac_bolge:[]
            })
          }

        }

      });
  }

  cropImage2 = () => {
    let xx = parseInt(this.state.sayac_bolge[0].x * this.state.image_size);
    let yy = parseInt(this.state.sayac_bolge[0].y * this.state.image_size);
    let ww = parseInt(this.state.sayac_bolge[0].w * this.state.image_size);
    let hh = parseInt(this.state.sayac_bolge[0].h * this.state.image_size);

    cropData = {
      offset: { x: xx, y: yy },
      size: { width: ww, height: hh },
      displaySize: { width: ww, height: hh },
      resizeMode: 'contain' //| 'contain' | 'stretch',
    };

    ImageEditor.cropImage(this.state.filePath2, cropData).then(url => {
      this.setState({
        filePath3: url
      });

    })
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTexttyle}>Plaka Okuma</Text>
        </View>
        <RNCamera
          style={styles.preview}
          zoom={0}
          autoFocus={'on'}
          // type={RNCamera.Constants.Type.back}
          // flashMode={RNCamera.Constants.FlashMode.on}
          ref={ref => {
            this.camera = ref
          }}
        >

          <View style={styles.imageGroupStyle}>
            <FastImage
              style={styles.imageStyle}
              source={{
                uri: this.state.filePath3,
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </RNCamera>

        <View style={styles.container2}>
          <View style={styles.buttonGroupStyle}>
            <View style={styles.textGroupStyle}>
              <Text style={styles.textStyle}>{this.state.sayac_deger}</Text>
            </View>
          

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.takePicture(this.camera)}
            >
              <Text style={styles.buttonTextStyle}>Plaka Bul</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 2
  },
  headerTexttyle: {
    color: '#125D98',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 5,
  },
  headerImageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  headerImageStyle2: {
    width: 70,
    height: 45,
    resizeMode: 'center'
  },
  container2: {
    width: windowWidth,
    height: windowWidth * 0.25,
    backgroundColor: '#fff'
  },
  buttonGroupStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: "#fff"
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: "#125D98",
    padding: 10,
    margin: 5,
    borderRadius: 5
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: windowWidth * 0.9,
  },
  textGroupStyle: {
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  imageGroupStyle: {
    alignItems: 'center',
  },
  imageStyle: {
    width: 300,
    height: 100
  },
})
