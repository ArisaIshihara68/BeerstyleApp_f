import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { MapView, Location, Permissions } from 'expo';

class MapScreen extends Component {
    state = {
        region: {
            longitude: 139.767125,
            latitude: 35.681236,
            longitudeDelta: 0.04,
            latitudeDelta: 0.09,
        },
        locationResult: null,
        location: { coords: { latitude: 35.681236, longitude: 139.767125 } },
    };

    componentDidMount() {
        this._getLocationAsync();
    }


    //現在地を取得
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
                location,
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ locationResult: JSON.stringify(location), location, });
    };

    render() {

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ alignSelf: 'stretch', height: 600 }}
                    region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}

                >
                    <MapView.Marker
                        coordinate={this.state.location.coords}
                        title="My Marker"
                        description="Some description"
                    />
                </MapView>
            </View>


        );
    }
}

export default MapScreen;