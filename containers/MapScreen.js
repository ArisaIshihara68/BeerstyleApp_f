import { connect } from 'react-redux'
import MapScreen from '../components/MapScreen'

const mapStateToProps = state => {
    return state
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
