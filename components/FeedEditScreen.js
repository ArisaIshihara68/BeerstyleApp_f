import React, { Component } from 'react'
import { Platform, StyleSheet, View, Text, Dimensions } from 'react-native'
import { Container, Content, Header, Left, Button, Thumbnail, Badge, Textarea } from 'native-base'
import { Icon, Permissions, ImagePicker } from 'expo'
import { feedCollection, uploadFeedImage, db, getNowDate } from '../modules/firebase'

class FeedEditScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
          feed: null,
        }
      }

    static navigationOptions = ({ navigation }) => ({
      title: 'beerstyle',
    })

    componentWillMount() {
        const uuid = this.props.navigation.getParam('uuid', null)
    
        if(uuid) {
          this.unsubscribe = feedCollection.doc(uuid).onSnapshot(doc => {
            const feed = doc.data()
            this.setState({
              feed : {
                image: feed.image,
                beer: feed.beer,
                rating: feed.rating,
                message: feed.message,
                location: feed.location,
              }
            })
          })
        }
    }

    pickImage = async () => {
        let isAccepted = true

        const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL)
        
        if(permission.status !== 'granted') {
        const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (newPermission.status !== 'granted') {
            isAccepted = false
        }
    }

    if(isAccepted) {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [9, 9]
        })

        if (!result.cancelled) {
            this.setState({ image: result.uri })
            console.log(result.uri)
        }
    }
  }

  updateFeed = async (feed) => {
    try{
      this.setState({ uploading: true })

      let downloadUrl = null
      if (feed.image) {
        downloadUrl = await uploadFeedImage(feed.image, uuid)
      }
      const uuid = this.props.navigation.getParam('uuid', null)
      const batch = db.batch()
      const feedRef = feedCollection.doc(uuid)

      await batch.set(feedRef, {
        message: feed.message,
        image: downloadUrl,
        beer: feed.beer,
        rating: feed.rating,
        location: feed.location,
        updated_at: getNowDate(),
      })
      await batch.commit().then(() => {
        console.log('edit feed success.')
      })
      
      // this.props.navigation.goBack()
    }
    catch(e) {
      console.log(e)
      alert('Upload feed failed, sorry :(')
    }
    finally {
      this.setState({ uploading: false })
    }
  }

  render () {
    const { feed } = this.state
    
    if(this.state.feed) {

      return (
        <Container style={styles.container}>
          <Content>
            <View style={styles.content}>
              <View style={styles.imageSection}>
                {this.state.feed.image ? (
                  <Thumbnail
                    large
                    square
                    source={{ uri: this.state.feed.image }}
                    style={styles.image}
                  />
                ) : null}

                <Badge style={styles.iconButton}>
                  <Icon.AntDesign
                    name='plus'
                    size={50}
                    color='white'
                    onPress={this.pickImage}
                  />
                </Badge>
              </View>

              <View style={styles.textSection}>
                <Textarea
                  style={styles.description}
                  rowSpan={1.2}
                  bordered
                  value={this.state.feed.beer ? this.state.feed.beer : ''}
                  onChangeText={beer => this.setState({ feed: { ...feed, beer } })}
                />
              </View>

              <View style={styles.textSection}>
                <Textarea
                  style={styles.description}
                  rowSpan={5}
                  bordered
                  placeholder={this.state.feed.message ? this.state.feed.message : ''}
                  onChangeText={message => this.setState({ feed: { ...feed, message } })}
                />
              </View>

              <View style={styles.textSection}>
                <Textarea
                  style={styles.description}
                  rowSpan={1.2}
                  bordered
                  placeholder={this.state.feed.location ? this.state.feed.location : ''}
                  onChangeText={location => this.setState({ feed: { ...feed, location } })}
                />
              </View>

              <Button
                style={styles.button}
                dark
                rounded
                onPress={() => this.updateFeed(this.state.feed)}
                disabled={this.state.uploading}
              >
                <Text style={styles.buttonText}>投稿を保存</Text>
              </Button>
            </View>
          </Content>
        </Container>
      )
    }
    else {
      return (
        <View style={styles.notLoginContainer}>
          <Text>Error</Text>
        </View>
      )
    }
  }
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notLoginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSection: {
    position: 'relative',
    width: width,
    height: width,
    backgroundColor: 'black',
    marginBottom: 20,
  },
  image: {
    width: width,
    height: width,
  },
  iconButton: {
    position: 'absolute',
    bottom: 32,
    right: width / 20,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  textSection: {
    padding: 5,
  },
  title: {
    width: width * 9 / 10,
    marginBottom: 20,
  },
  description: {
    width: width * 9 / 10,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
  },
  loginButton: {
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

export default FeedEditScreen