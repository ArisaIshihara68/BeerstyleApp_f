import React, { Component } from 'react'
import { StyleSheet, View, Image, Dimensions } from 'react-native'
import { Container, Content, Thumbnail, Button, Card, CardItem, Body, Text } from 'native-base'
import { authFacebook, logout, userCollection, feedCollection } from '../modules/firebase'
import moment from 'moment-timezone'

class ProfileScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      feeds: null,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'beerstyle',
  })

  componentWillMount() {
    this.unsubscribe = userCollection.doc(this.props.user.uid || '_').onSnapshot(doc => {
      const properties = doc.data()
      if (properties) {
        this.props.handleSetUserProperties(Object.assign({
          avatar: null,
          name: null,
        }, properties))
      }
      else {
        this.props.handleSetUserProperties({
          avatar: null,
          name: null,
        })
      }
      console.log(properties)
    })
    this.unsubscribe = feedCollection.where('writer', '==', this.props.user.uid).onSnapshot(querySnapshot => {
      const feeds = []
      querySnapshot.forEach(doc => {
        feeds.push({ uuid: doc.id, ...doc.data() })
      })
      feeds.reverse()
      this.setState({ feeds })
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    if (this.props.user.uid) {

      const tempAvatar = 'https://firebasestorage.googleapis.com/v0/b/novels-a5884.appspot.com/o/temp%2Ftemp.png?alt=media&token=a4d36af6-f5e8-49ad-b9c0-8b5d4d899c0d'

      return (
        <Container style={styles.container}>
          <Content>
            <View style={styles.content}>
              <View style={styles.profileSection}>
                <View style={styles.profileMain}>
                  <Thumbnail
                    large
                    source={{ uri: this.props.user.properties.avatar ? this.props.user.properties.avatar : tempAvatar }}
                    style={styles.avatar}
                  />
                  <Text style={styles.name}>{this.props.user.properties.name ? this.props.user.properties.name : '未設定'}</Text>
                </View>
                <Button
                  style={styles.editButton}
                  transparent
                  dark
                  onPress={() => this.props.navigation.navigate('Edit')}
                >
                  <Text style={styles.buttonText}>プロフィール編集</Text>
                </Button>
                <Button
                  style={styles.logoutButton}
                  dark
                  rounded
                  onPress={logout}
                >
                  <Text style={styles.buttonText}>ログアウト</Text>
                </Button>
              </View>
            </View>
          </Content>
          <Content>
            {this.state.feeds && this.state.feeds.map(element => {
              let date
              try {
                date = moment.unix(element.created_at.seconds).format('YYYY/MM/DD HH:mm:ss')
              }
              catch (e) {
                console.log(e)
                date = '投稿日不明'
              }

              return (
                <Card style={styles.card} key={element.uuid}>
                  <CardItem cardBody button onPress={() => this.props.navigation.navigate('Detail', { uuid: element.uuid })}>
                    <Image
                      style={styles.image}
                      source={{ uri: element.image }}
                    />
                  </CardItem>
                  <CardItem style={styles.inner} button onPress={() => this.props.navigation.navigate('Detail', { uuid: element.uuid })}>
                    <Body>
                      <Text>{element.beer}</Text>
                      <Text>{element.message}</Text>
                      <Text>{element.rating}</Text>
                      <Text style={styles.date}>{date}</Text>
                    </Body>
                  </CardItem>
                </Card>
              )
            })}
          </Content>
        </Container>
      )
    }
    else {
      return (
        <View style={styles.notLoginContainer}>
          <Button
            style={styles.loginButton}
            dark
            rounded
            onPress={authFacebook}
          >
            <Text style={styles.buttonText}>Login with Facebook</Text>
          </Button>
        </View>
      )
    }
  }
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  notLoginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: width,
    height: height / 3,
    padding: 10,
    backgroundColor: 'black',
  },
  avatar: {
    width: height / 5,
    height: height / 5,
    borderRadius: height / 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  editButton: {
    position: 'absolute',
    padding: 10,
    bottom: 10,
    right: 10,
  },
  logoutButton: {
    position: 'absolute',
    padding: 10,
    bottom: 10,
    left: 10,
  },
  loginButton: {
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    fontSize: 10.5,
    color: 'white',
  },
  card: {
    width: width,
    height: 300,
  },
  image: {
    width: width,
    height: 200,
    overflow: 'hidden',
  },
  date: {
    position: 'absolute',
    top: 50,
    left: 0,
    color: 'gray',
    fontSize: 10.5,
  },
})

export default ProfileScreen