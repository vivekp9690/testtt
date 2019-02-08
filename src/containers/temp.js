		<View style={styles.row}>
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this._toggleModal()}>
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1517982732_1517028866_72_scan@2x.png"}} />
                  
                <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>Scan</Text>
                </View>
            </TouchableOpacity>  
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={this.onSearchClick}>
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1517904020_1516714973_search@2x.png"}} />
              <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>Search</Text>
              </View>    
              
            </TouchableOpacity> 
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress = {
                        () => this.onAbountUsClick()}>
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1517904020_1516714973_about-us@2x.png"}} />
                  
              <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>About Us</Text>
              </View>
            </TouchableOpacity> 
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1}>
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1517904020_1516714973_chat@2x.png"}} />
              
              <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>Chat</Text>
              </View>    
              
            </TouchableOpacity>  
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} >
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1517904020_1517219377_RSS_FEEDS2X.png"}} />
              
              <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>Recall</Text>
              </View>    
              
            </TouchableOpacity> 
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} >
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1517904020_1516864506_invite@2x.png"}} />
              
              <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>Invite</Text>
              </View>    
              
            </TouchableOpacity> 
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={this.onVerityTokenClick}>
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1519625621_Verity-form-icon2x.png"}} />
              
              <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>VERITY Token</Text>
              </View>    
              
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={this.onLogoutClick}>
              <Image style={styles.image}  source={{uri: "https://t.certified.bz/components/com_applicationsetting/assets/images/menuicon/1519625621_Verity-form-icon2x.png"}} />
              
              <View style={[styles.textView]}>
                  <Text style={[styles.btnText]}>Logout</Text>
              </View> 
            </TouchableOpacity>
            
            <View style={[styles.row,styles.box_new]}></View>
          </View>