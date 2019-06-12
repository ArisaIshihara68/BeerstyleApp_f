import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { MapView } from 'expo';

class MapScreen extends Component {
    state = {
        region: {
            longitude: 139.767125,
            latitude: 35.681236,
            longitudeDelta: 0.04,
            latitudeDelta: 0.09,
        },
    }
    render() {
        /*navigator.geolocation.getCurrentPosition(
            pos => this.setState(
                { longitude: pos.coords.longitude, latitude: pos.coords.latitude, longitudeDelta: 0.04, latitudeDelta: 0.09 }
            ),
            err => console.log(err)
        );*/
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    // region={this.state.pos}
                    region={this.state.region}
                    style={{ flex: 1 }}
                />
            </View>


        );
    }
}

export default MapScreen;