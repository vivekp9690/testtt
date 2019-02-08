import firebase from 'firebase';

import firebaseService from '../config/firebaseService';
import { Permissions, Notifications } from 'expo';

import {
    AsyncStorage,
    Alert,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

class Backend {
    uid = '';
    messagesRef = null;
    usersRef=null;
    loggedInUserId='';
    // initialize Firebase Backend
    constructor() {


        firebaseService.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("backend We are authenticated now! >> ", user.uid);
                this.setUid(user.uid);
                
                Notifications.getExpoPushTokenAsync().then((token) => {
                    console.log("Token => ", token);
                    if(this.getloggedInUserId()){
                        Permissions.askAsync(Permissions.NOTIFICATIONS).then((notification)=>{
                            if (notification.status !== 'granted') {
                                return;
                            }
                            this.userRef = firebase.database().ref('verityUsers/' + this.getloggedInUserId())
                            .update({ token: token });
                            Notifications.addListener((notification) => {
                                console.log("notification ==> ", notification);
                                if(notification.origin == "selected")
                                {
                                    if(notification.data.senderId == 631)
                                    {
                                        AsyncStorage.getItem('name',
                                        (err, value) => {
                                            if (value != "") {
                                                Actions.Chat({'userName':value})
                                            }
                                        }); 
                                    }
                                    else
                                    {
                                        Actions.ChatUser({'userName':notification.data.senderName,'userId':notification.data.senderId});
                                    }
                                }
                                else if(notification.origin == "received")
                                {
                                    AsyncStorage.getItem('isChatOpen',
                                    (err, value) => {
                                        if (value == "No") 
                                        {
                                            if(notification.data.senderId == 631)
                                            {
                                                Alert.alert(
                                                    notification.data.senderName,
                                                    notification.data.message, [
                                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                        {text: 'View',onPress: () => {
                                                            console.log('View Pressed');
                                                            
                                                            AsyncStorage.getItem('name',
                                                            (err, value) => {
                                                                if (value != "") {
                                                                    AsyncStorage.setItem('isChatOpen', "Yes");
                                                                    Actions.Chat({'userName':value})
                                                                }
                                                            }); 
                                                        }} ,
                                                        {text: 'Cancel',onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                    ], {
                                                        cancelable: true
                                                    }
                                                )
                                                
                                            }
                                            else
                                            {

                                                Alert.alert(
                                                    notification.data.senderName,
                                                    notification.data.message, [
                                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                        {text: 'View',onPress: () => {
                                                            console.log('View Pressed');
                                                            AsyncStorage.setItem('isChatOpen', "Yes");
                                                            Actions.ChatUser({'userName':notification.data.senderName,'userId':notification.data.senderId});
                                                        }} ,
                                                        {text: 'Cancel',onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                    ], {
                                                        cancelable: true
                                                    }
                                                )
                                            
                                            }
                                        }
                                    });    
                                }
                                /// Selected origin (Select notification from notification bar)
        
                                /// received origin (message received while app running)
                            });
                        });
                    }
                });
                AsyncStorage.getItem('userId',
                    (err, value) => {
                        if (value != "") {
                            this.setloggedInUserId(value);
                        }
                    }); 
                } else {
                    firebaseService.auth().signInAnonymously().catch((error) => {
                        alert(error.message);
                    });
            }
        });
       
        
               
    }
    async componentWillMount() {
        firebaseService.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("backend We are authenticated now! >> ", user.uid);
                this.setUid(user.uid);
                AsyncStorage.getItem('userId',
                    (err, value) => {
                        if (value != "") {
                            this.setloggedInUserId(value);
                        }
                    }); 
                } else {
                    firebaseService.auth().signInAnonymously().catch((error) => {
                        alert(error.message);
                    });
            }
        });
        
        const {
            Rollstatus
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({
            hasCameraRollPermission: Rollstatus === 'granted'
        });
    }
    setloggedInUserId(value) {
    
        this.loggedInUserId=value;
    }
    getloggedInUserId() {
    
        return this.loggedInUserId;
        // return 418;
    }
    setUid(value) {
        this.uid = value;
    }
    getUid() {
        return this.uid;
    }
    // retrieve the messages from the Backend
    async loadMessages(callback) {
        let chatId = this.getloggedInUserId() + "_631";

        this.messagesRef = firebase.database().ref('chat/' + chatId);
        firebase.database().ref('chat')
            .once('value', snapshot => {
                if (snapshot.hasChild(chatId)) {
                    this.messagesRef = firebase.database().ref('chat/' + chatId);
                    // this.messagesRef = firebase.database().ref('chat/418_631');
                    // this.messagesRef = firebase.database().ref('chat');

                    // console.log("message ref ", this.messagesRef);
                    this.messagesRef.off();
                    const onReceive = (data) => {
                        const message = data.val();
                        // console.log(data.key)
                        // console.log("................receiving....................")
                        // console.log(message)

                        callback({
                            _id: data.key,
                            text: message.message,
                            receiver: message.receiver,
                            createdAt: new Date(Number(message.timestamp)),
                            receiverId: message.receiverId,
                            sender: message.sender,
                            senderId: message.senderId,
                            user: {
                                _id: message.senderId,
                                name: message.sender,
                                avatar: message.senderImage
                            }
                        });
                    };

                    this.messagesRef.limitToLast(20).on('child_added', onReceive);
                }
                else {
                    console.log("no child............")
                    callback({});

                    const onReceive = (data) => {
                        const message = data.val();
                        // console.log(data.key)
                        // console.log("................receiving....................")
                        // console.log(message)

                        callback({
                            _id: data.key,
                            text: message.message,
                            receiver: message.receiver,
                            createdAt: new Date(Number(message.timestamp)),
                            receiverId: message.receiverId,
                            sender: message.sender,
                            senderId: message.senderId,
                            user: {
                                _id: message.senderId,
                                name: message.sender,
                                avatar: message.senderImage
                            }
                        });
                    };

                    this.messagesRef.limitToLast(20).on('child_added', onReceive);


                }
            });
    }


    // send the message to the Backend
    async sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            currentTimestamp=(new Date).getTime().toString();
            this.messagesRef.child(currentTimestamp).set(
                {
                        'isRead':"0",    
                        'message': message[i].text,
                        'receiver':'Admin',
                        // 'timestamp': firebase.database.ServerValue.TIMESTAMP,
                        'timestamp': currentTimestamp,
                        'receiverId':"631",
                        'sender':message[i].user.name,
                        'senderId':this.getloggedInUserId(),
                        'senderImage':"https://lh3.googleusercontent.com/-k-zUg_LS6t8/AAAAAAAAAAI/AAAAAAAAAAs/qPcUE-iekjs/s400/photo.jpg"
                        
            });
            let title = message[i].user.name + " has sent a message";
            this.sendPushNotification('631',this.getloggedInUserId(),message[i].user.name, title, message[i].text);
        }
    }
    // close the connection to the Backend
    closeChat() {
        if (this.messagesRef) {
            this.messagesRef.off();
        }
    }
    sendPushNotification (userId,senderId,senderName, title, message) {
        console.log("Notification", userId);
        return Permissions.askAsync(Permissions.NOTIFICATIONS).then((notification)=> {
            console.log("Permission ", notification)
            if (notification.status !== 'granted') {
                return;
            }
            firebase.database().ref('verityUsers/' + userId).once('value', (data) => {
                let userData = data.val();
                if (userData && userData.token) {
                    console.log("Sender User token", userData.token);
                    fetch('https://exp.host/--/api/v2/push/send', {
                        body: JSON.stringify({
                            to: userData.token,
                            title: title,
                            body: message,
                            data: {
                                senderId: senderId,
                                senderName:senderName,
                                message:message
                            }
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    });
                }
            });
        });
    }    
}

export default new Backend();