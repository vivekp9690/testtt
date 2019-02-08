#

Go into the project directory and run 

    npm install
    
Add iOS platform 

    react-native upgrade

Run project in xcode    


/Users/yadavbiren/Documents/Projects/react-native/VerityOne/VerityOne/Keystore/verity_keystore.jks



to Generate keystore file:  keytool -genkey -v -keystore verity.keystore -alias Verity -keyalg RSA -keysize 2048 -validity 10000


-- Generate signed android APK

1) /Users/yadavbiren/Documents/Projects/react-native/VerityOne/VerityOne/android/build.gradle

android{
    signingConfigs {
        release {

        v1SigningEnabled true,
        v2SigningEnabled true
        }
    }
}

2) exp build:android -c

- provide keystore path(/Users/yadavbiren/Documents/Projects/react-native/VerityOne/VerityOne/Keystore/verityOne.jks), alias , key and keystore password

3) Upload APK file in developer store account(realease section-> create Release)




-- Generate Signed iOS ipa

1) exp build:ios -c

- provide apple id and password

2) Give path of distribution certificate P12 file

/Users/yadavbiren/Documents/Projects/react-native/VerityOne/VerityOne/Keystore/iOSDevelopment.p12
pwd:123456

3) Please provide the path to your push notification cert P12
? Path to P12 file: /Users/yadavbiren/Documents/Projects/react-native/VerityOne/VerityOne/Keystore/Certificates_3.p12

pwd:123456


4) Please provide the path to mobile provision

5) Download ipa file and upload in xcode-> open developer tool-> application loader

6) Provide itune credential and upload ipa file, wait until completing process

-- Test signed ipa without uploading on test flight

1) In react native project> exp build:ios -t simulator

- it will generate tar.gz file

2) goto tar.gz file folder> tar -xvzf your-app.tar.gz

- unpack tar.gz

3) drag unpacked folder into simulator, it will install your application.