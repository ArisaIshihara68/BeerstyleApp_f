import React, { Component } from 'react'
import { StyleSheet, Image, Dimensions } from 'react-native'
import { Container, Content, Card, CardItem, Body, Text, Icon } from 'native-base'
import moment from 'moment-timezone'
import { feedCollection, likeCollection, likepost, getUid } from '../modules/firebase'

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      feeds: [],
      likeFeeds: [],
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'beerstyle',
  })

  componentWillMount() {
    this.unsubscribe = feedCollection.orderBy('created_at').onSnapshot(querySnapshot => {
      const feeds = []
      querySnapshot.forEach(doc => {
        feeds.push({ uuid: doc.id, ...doc.data(), liked: false })
      })
      feeds.reverse()
      this.setState({ feeds })
    })
    // likeCollection.where('User_id', '==', getUid().uid).onSnapshot(snapshot => {
    //   const likeFeeds = []
    //   snapshot.forEach(like => {
    //     likeFeeds.push(like.data().Feed_id)
    //   })
    //   this.setState({
    //     ...this.state,
    //     likeFeeds
    //   })
    // })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onLikePress = async (feed) => {
    try {
      likepost(feed)
    }
    catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <Container style={styles.container}>
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
                  {/* {
                    this.state.likeFeeds.includes(element.uuid) ?
                      <Icon
                        name="heart"
                        style={{ color: '#ED4A6A', position: 'absolute',right: 10, bottom: 0, fontSize: 30, }}
                        onPress={() => this.onLikePress(element)}
                      /> : 
                      <Icon
                        name="heart"
                        style={{ position: 'absolute',right: 10, bottom: 0,fontSize: 30, }}
                        onPress={() => this.onLikePress(element)}
                      /> 
                  } */}
                </CardItem>
                <CardItem style={styles.inner} button onPress={() => this.props.navigation.navigate('Detail', { uuid: element.uuid })}>
                  <Body>
                    <Text style={styles.beer}>{element.beer}</Text>
                    <Text style={styles.message}>{element.message}</Text>
                    <Text style={styles.location}>{element.location}</Text>
                    <Text style={styles.rating}>{element.rating}</Text>
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
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width,
    height:400,
  },
  image: {
    width: width,
    height: 300,
    overflow: 'hidden',
  },
  date: {
    position: 'absolute',
    top: 70,
    right: 0,
    color: 'gray',
    fontSize: 10.5,
  },
  rating: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 42,
  },
  location: {
    position: 'absolute',
    top: 50,
    right: 0,
    fontSize: 15,
  },
  beer: {
    fontSize: 25,
  },
  message: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
    width: 230,
    height: 50,
  },
})

export default HomeScreen