# object_detection_with_react_native
Python ile eğittiğim plaka bulma modelini react native ile kullanılması

<div class="row">
  <img src="https://raw.githubusercontent.com/mecitsezginn/object_detection_with_react_native/main/foto/1.jpeg" width="200" title="hover text">
  <img src="https://raw.githubusercontent.com/mecitsezginn/object_detection_with_react_native/main/foto/2.jpeg" width="200" title="hover text">
  <img src="https://raw.githubusercontent.com/mecitsezginn/object_detection_with_react_native/main/foto/3.jpeg" width="200" title="hover text">
  <img src="https://raw.githubusercontent.com/mecitsezginn/object_detection_with_react_native/main/foto/4.jpeg" width="200" title="hover text">
</div>


## kütüphaneler
```
npm i @react-native-community/image-editor
npm i @react-native-community/slider
npm i react-native-camera
npm i react-native-fast-image
npm i react-native-image-resizer
npm i tflite-react-native
```

## izinler
Kamera için izinler ```android > app > src > main > AndroidMAnifest.xml``` dosyaya aşağıdaki komutları ekliyoruz.

```
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>

<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.front" android:required="false" />
```

Telefon ekranının dönmemesi için komut aynı dosyaya ``` activity``` nin içine aşağıdaki komutu ekliyoruz.
```
android:screenOrientation="portrait"
```

## tflite ile camera kütüphaneleri için komutlar
tflite ve camera kütüphanlerinin çalışması için ```android > app > build.gradle``` dosyasına aşağıdaki komutları ekliyoruz.

tflite için;
```
android{
  aaptOptions {
    noCompress 'tflite'
  }
}


dependencies {
  implementation 'org.tensorflow:tensorflow-lite:+'
}
```

camera için;
```
android{
  defaultConfig {
    vectorDrawables.useSupportLibrary = true
    missingDimensionStrategy 'react-native-camera', 'general'
  }
}
```

## tflite-react-native kütüphanesinde yapılacak işlemler
```node_modules > tflite-react-native > android > src > main > java > com > reactlibrary > TfliteReactNativeModule.java```
dosyasında NUM_DETECTIONS değişkeni modelin çıktı sayısını tutuyor. Çıktı sayısına göre değişiklik yapabiliriz.

<img src="https://raw.githubusercontent.com/mecitsezginn/object_detection_with_react_native/main/foto/output.png" width="500" title="hover text">

## model ve label dosyasını projeye ekleme
``` android > app > src > main > assets``` klasörünün içine model ve label dosyamızı yapıştırıyoruz.

