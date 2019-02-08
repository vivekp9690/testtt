import firebase from 'firebase';

import firebaseService from '../config/firebaseService';
import { Permissions, Notifications } from 'expo';


import {
    AsyncStorage
} from 'react-native';

class BackendUser {
    uid = '';
    messagesRef = null;
    usersRef=null;
    loggedInUserId='';
    // initialize Firebase Backend
    constructor() {

        
        firebaseService.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("backend user We are authenticated now! >> ", user.uid);
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
       

               
    }
    componentWillMount() {
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
    loadMessages(callback) {
        console.log('chat/' + this.getloggedInUserId()+"_631")

        this.messagesRef = firebase.database().ref('chat/' + this.getloggedInUserId()+"_631");
        firebase.database().ref('chat')
        .once('value', snapshot => {
            if(snapshot.hasChild(this.getloggedInUserId()+"_631")) {
                this.messagesRef = firebase.database().ref('chat/' + this.getloggedInUserId()+"_631");
                // this.messagesRef = firebase.database().ref('chat/418_631');
                // this.messagesRef = firebase.database().ref('chat');

                console.log("message ref ",this.messagesRef);
                this.messagesRef.off();
                const onReceive = (data) => {
                    const message = data.val();
                    // console.log(data.key)
                    console.log("................receiving....................")
                    console.log(message)

                    callback({
                        _id: data.key,
                        text: message.message,
                        receiver:message.sender,
                        createdAt: new Date(Number(message.timestamp)),
                        receiverId:message.senderId,
                        sender:message.receiver,
                        senderId:message.receiverId,
                        user: {
                            _id: message.receiverId,
                            name: message.receiver,
                            avatar:message.senderImage
                        }
                    });
                };
                 
        // this.messagesRef = firebase.database().ref('messages');
        // this.messagesRef.off();
        // const onReceive = (data) => {
        //     const message = data.val();
        //     console.log(data.key)
        //     console.log(message)
        //     callback({
        //         _id: data.key,
        //         text: message.text,
        //         createdAt: new Date(message.createdAt),
        //         user: {
        //             _id: message.user._id,
        //             name: message.user.name,
        //         }
        //     });
        // };
        
                // console.log("DDD ",snapshot)
                
                this.messagesRef.limitToLast(20).on('child_added', onReceive);
            }
            else
            {
                console.log("no child............")
                callback({});

                const onReceive = (data) => {
                    const message = data.val();
                    // console.log(data.key)
                    console.log("................receiving....................")
                    console.log(message)

                    callback({
                        _id: data.key,
                        text: message.message,
                        receiver:message.sender,
                        createdAt: new Date(Number(message.timestamp)),
                        receiverId:message.senderId,
                        sender:message.receiver,
                        senderId:message.receiverId,
                        user: {
                            _id: message.receiverId,
                            name: message.receiver,
                            avatar:message.senderImage
                        }
                    });
                };
                this.messagesRef.limitToLast(20).on('child_added', onReceive);
            } 
            
            
      });
        
        
    }
    // send the message to the Backend
    sendMessage(message) {
        let msg=[]
        for (let i = 0; i < message.length; i++) {
            console.log(">....",message[i]);
            
            // this.messagesRef.push({
            //     text: message[i].text,
            //     user: message[i].user,
            //     createdAt: firebase.database.ServerValue.TIMESTAMP,
            // });
            
            console.log(".......",msg)

            

            // this.messagesRef.push(
            //     {
            //             'isRead':"0",    
            //             'message': message[i].text,
            //             'receiver':'Admin',
            //             'timestamp': firebase.database.ServerValue.TIMESTAMP,
            //             'receiverId':"631",
            //             'sender':message[i].user.name,
            //             'senderId':this.getloggedInUserId(),
            //             'senderImage':"https://lh3.googleusercontent.com/-k-zUg_LS6t8/AAAAAAAAAAI/AAAAAAAAAAs/qPcUE-iekjs/s400/photo.jpg"
                        
            // });
            // let currentTimestamp=(firebase.database.ServerValue.TIMESTAMP).toString();
            // console.log(currentTimestamp,",,,,,,,,,,")

            // (new Date).getTime()
            currentTimestamp=(new Date).getTime().toString();
            this.messagesRef.child(currentTimestamp).set(
                {
                        'isRead':"0",    
                        'message': message[i].text,
                        'receiver':message[i].user.name,
                        // 'timestamp': firebase.database.ServerValue.TIMESTAMP,
                        'timestamp': currentTimestamp,
                        'receiverId': this.getloggedInUserId(),
                        'sender':"Admin",
                        'senderId':"631",
                        'senderImage':"https://lh3.googleusercontent.com/-k-zUg_LS6t8/AAAAAAAAAAI/AAAAAAAAAAs/qPcUE-iekjs/s400/photo.jpg"
                        
            });
            let title = "Admin has sent a message";
            this.sendPushNotification(this.getloggedInUserId(),631,"Admin", title, message[i].text);
                        
        }
    }
    // close the connection to the Backend
    closeChat() {
        if (this.messagesRef) {
            this.messagesRef.off();
        }
    }


    loadUsers(callback) {
        console.log('chat/' + this.getloggedInUserId()+"_631")

        this.usersRef = firebase.database().ref('users');
                console.log("usersRef  ",this.usersRef);
                this.usersRef.off();
                const onReceive = (data) => {
                    const user = data.val();
                    // console.log(data.key)
                    console.log("................receiving....users................")
                    console.log(user)

                    callback({
                        _id: data.key,
                        text: message.message,
                        receiver:message.receiver,
                        createdAt: new Date(Number(message.timestamp)),
                        receiverId:message.receiverId,
                        sender:message.sender,
                        senderId:message.senderId,
                        user: {
                            _id: message.senderId,
                            name: message.sender,
                            avatar:message.senderImage
                        }
                    });
                };
                 
        
                this.usersRef.limitToLast(20).on('child_added', onReceive);
            
            
            
    }
    sendPushNotification (userId, senderId, senderName, title, message) {
        return Permissions.askAsync(Permissions.NOTIFICATIONS).then((notification)=> {
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

export default new BackendUser();