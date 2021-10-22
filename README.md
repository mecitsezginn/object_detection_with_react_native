# object_detection_with_react_native
Python ile eğittiğim plaka bulma modelini react native ile kullanılması

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


