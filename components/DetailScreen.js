import React, { Component } from 'react'
import { Platform, StyleSheet, Dimensions, View, Text, Image, TouchableOpacity } from 'react-native'
import { Container, Content, Header, Left, Button, Thumbnail } from 'native-base'
import moment from 'moment-timezone'
import { Icon } from 'expo'
import { feedCollection, userCollection, getUid } from '../modules/firebase'

class DetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      feed: null,
      writer: null,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  componentWillMount() {
    const uuid = this.props.navigation.getParam('uuid', null)

    if (uuid) {
      this.unsubscribe = feedCollection.doc(uuid).onSnapshot(doc => {
        const feed = doc.data()

        let date
        try {
          date = moment.unix(feed.updated_at.seconds).format('YYYY/MM/DD HH:mm:ss')
        }
        catch (e) {
          console.log(e)
          date = '投稿日不明'
        }

        this.setState({
          feed: {
            uuid: uuid,
            image: feed.image,
            beer: feed.beer,
            rating: feed.rating,
            message: feed.message,
            location: feed.location,
            writer: feed.writer,
            updated_at: date,
          }
        })

        userCollection.doc(feed.writer).get()
          .then(_doc => {
            if (_doc.exists) {
              const user = _doc.data()
              this.setState({
                user: {
                  name: user.name,
                  avatar: user.avatar,
                }
              })
            }
            else {
              this.setState({
                user: {
                  name: null,
                  avatar: null,
                }
              })
            }
          })
          .catch(error => {
            this.setState({
              user: {
                name: null,
                avatar: null,
              }
            })
            console.log(error)
          })
      })
    }
  }

  // deleteFeed = async (properties) => {
  //   try{
  //     feedCollection.doc(properties).delete()
  //     this.props.navigation.navigate('Home')
  //   }
  //   catch(e) {
  //     console.log(e)
  //     alert('cant delete, sorry :(')
  //   }
  //   finally {
  //     this.setState({ uploading: false })
  //   }
  // }

  render() {

    const uuid = this.props.navigation.getParam('uuid', null)
    const { uid } = getUid()

    if (!this.state.feed) {
      return (
        <View style={styles.notLoginContainer}>
          <Text>Error</Text>
        </View>
      )
    }

    return (
      <Container style={styles.container}>
        <Header transparent>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon.Ionicons
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-back'
                }
                size={24}
                style={styles.backBtn}
                color='black'
              />
            </Button>
          </Left>
        </Header>

        {this.state.feed &&
          <Content style={styles.content}>
            <Image
              source={{ uri: this.state.feed.image }}
              style={styles.image}
            />
            <View style={styles.words}>
              {this.state.user &&
                <View style={styles.writer}>
                  <Thumbnail small source={{ uri: this.state.user.avatar }} style={styles.avatar} />
                  <View>
                    <Text style={styles.writerName}>{this.state.user.name}</Text>
                    <Text style={styles.date}>{this.state.feed.updated_at} にこの記事は更新されています。</Text>
                  </View>
                </View>
              }

              <View style={styles.divider} />

              <Text style={styles.description}>{this.state.feed.beer}</Text>

              <Text style={styles.description}>{this.state.feed.rating}</Text>

              <Text style={styles.description}>{this.state.feed.message}</Text>

              <Text style={styles.description}>{this.state.feed.location}</Text>

              {(() => {
                  if (this.state.feed.writer == uid) {
                    return (
                      <Button
                        transparent
                        dark
                        onPress={() => this.props.navigation.navigate('Edit', { uuid: uuid })}
                      >
                        <Text>投稿編集</Text>
                      </Button>
                    )
                  }
                })()}

              {/* <Button
                transparent
                dark
                onPress={() => this.deleteFeed(uuid)}
              >
                <Text>投稿削除</Text>
              </Button> */}
            </View>
          </Content>
        }
      </Container>
    )
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
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  image: {
    // square !!
    width: width,
    height: width,
  },
  words: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  avatar: {
    marginRight: 5,
  },
  writer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  writerName: {
    fontSize: 10.5,
  },
  date: {
    fontSize: 10.5,
    color: 'gray',
  },
  description: {
    fontSize: 20,
  },
  divider: {
    height: 10,
  },
  dividerHalf: {
    height: 5,
  }
})

export default DetailScreen