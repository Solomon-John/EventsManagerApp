import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { Input, Row } from 'react-materialize';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CenterActions from '../../actions/center-action';
import Loader from '../reusables/loader';
import history from '../../helpers/history';
import FormValidator from '../../helpers/form-validator';
import Header from '../header';
import Logger from '../../helpers/logger';


const centerAction = new CenterActions();


const facilities = [
  'CCTV',
  'VIP LOUNGE',
  'PROJECTOR',
  'MEDIA SUPPORT',
  'SECURITY',
  'WIFI'
];

const propTypes = {
  updateCenter: PropTypes.func.isRequired,
  stateProps: PropTypes.objectOf(() => null),
  location: PropTypes.objectOf(() => null).isRequired
};

const defaultProps = {
  stateProps: {},
};
/**
 *component for create center modal
 */
class UpdateCenterModal extends Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      center: {},
      errors: {},
      loading: false,
      message: '',
      states: []
    };

    this.onChange = this.onChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onMultiSelect = this.onMultiSelect.bind(this);
  }

  /**
   * @returns {*} set value of props to center on initial render
   */
  componentWillMount() {
    const { center } = this.props.location.state.state;
    const facilitiesArr = center.facilities.map(f => f.toUpperCase());
    axios.get('/api/v1/states')
      .then((response) => {
        this.setState({
          states: response.data,
          center: {
            id: center.id,
            name: center.name,
            address: center.address,
            stateId: center.stateId.toString(),
            hallCapacity: center.hallCapacity.toString(),
            carParkCapacity: center.carParkCapacity.toString(),
            price: center.price.toString(),
            image: {},
            facilities: facilitiesArr
          }
        }, () => Logger.log(center));
      });
  }

  /**
   *
   * @param {*} nextProps
   * @returns {*} to set state when props changes
   */
  componentWillReceiveProps(nextProps) {
    const { message } = this.state;
    if (nextProps.stateProps.response.data !== message) {
      this.setState({
        message: nextProps.stateProps.response.data
      }, () => {
        if (nextProps.stateProps.response.data) {
          this.setState({
            loading: false
          });
          history.push('/centers');
        }
      });
    }
    if (nextProps.stateProps.response.data === 'failed') {
      this.setState({
        loading: false
      });
    }
  }

  /**
  *@param {*} event
  *@returns {*}
  *this handles the event when any property in the state changes
  */
  onChange(event) {
    const { name, value } = event.target;
    const { center } = this.state;
    this.setState({
      center: {
        ...center,
        [name]: value
      }
    });
  }

  /**
  *@param {*} event
  *@returns {*}
  *this handles the event when any property in the state changes
  */
  onFileChange(event) {
    const { name, files } = event.target;
    const { center } = this.state;
    this.setState({
      center: {
        ...center,
        [name]: files[0]
      }
    });
  }

  /**
   *
   * @param {*} event
   * @param {*} index
   * @param {*} values
   * @returns {*} handles selecttion of facilities
   */
  onMultiSelect(event, index, values) {
    console.log('hey!!');
    const { center } = this.state;
    this.setState({
      center: {
        ...center,
        facilities: values
      }
    });
  }

  /**
   *
   * @param {*} event
   * @returns {*}
   * this handles the event when form is submitted
   */
  onSubmit(event) {
    event.preventDefault();
    console.log(this.state.center);
    if (this.isValid() === true) {
      this.setState({
        loading: true
      });
      const { updateCenter } = this.props;
      updateCenter(this.state.center);
    }
  }

  /**
   *@returns {*} check if form imputs are valid
   */
  isValid() {
    let validity = true;
    const formValidator = new FormValidator();
    const { errors, isValid } = formValidator.validateCenterInput(this.state.center);
    if (isValid === false) {
      this.setState({ errors });
      validity = false;
      return validity;
    }
    return validity;
  }

  /**
   *
   * @param {*} values
   * @returns {*}
   * this handles population facilities in a select box
   */
  menuItems(values) {
    return facilities.map(facility => (
      <MenuItem
        key={facility}
        insetChildren
        checked={values && values.indexOf(facility) > -1}
        value={facility}
        primaryText={facility}
      />
    ));
  }

  /**
   *@returns {*} renders the modal
   */
  render() {
    const {
      errors, loading, center, states
    } = this.state;
    return (
      <div>
        <div style={{
          backgroundColor: 'rgb(5, 22, 22)',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          paddingBottom: '20px',
          overflow: 'auto'
        }}
        >
          <Header />
          <div className="container">
            <Row>
              <div className="card-panel white contain2 animated bounceInRight">
                <div className="title">Create New Center</div>
                <div className={['row'].join(' ')}>
                  <Input
                    s={6}
                    id="image_url"
                    type="text"
                    name="name"
                    value={!center.name ? '' : center.name}
                    onChange={this.onChange}
                    className="validate"
                    label="Center Name"
                    labelClassName={center.name && 'active'}
                  />
                  <Input s={6} name="stateId" value={center.stateId} onChange={this.onChange} type="select" label="States">
                    <option defaultValue="State" disabled>Select States</option>
                    {
                      states.map(state => (
                        <option
                          key={state.id}
                          value={state.id}
                        >{state.statName}
                        </option>
                      ))
                    }
                  </Input>
                </div>
                <div className="row">
                  <Input
                    s={6}
                    id="address"
                    type="text"
                    className="validate"
                    name="address"
                    value={!center.address ? '' : center.address}
                    onChange={this.onChange}
                    label="Center Address"
                    labelClassName={center.address && 'active'}
                  />
                  <Input
                    s={6}
                    id="price"
                    name="price"
                    value={!center.price ? '' : center.price}
                    type="number"
                    onChange={this.onChange}
                    className="validate"
                    label="Center Price"
                    labelClassName={center.price && 'active'}
                  />
                </div>
                <div className="row">
                  <Input
                    s={6}
                    id="hall"
                    name="hallCapacity"
                    value={!center.hallCapacity ? '' : center.hallCapacity}
                    type="number"
                    onChange={this.onChange}
                    className="validate"
                    label="Hall Capacity"
                    labelClassName={center.hallCapacity && 'active'}
                  />
                  <Input
                    s={6}
                    id="carPark"
                    name="carParkCapacity"
                    value={!center.carParkCapacity ? '' : center.carParkCapacity}
                    type="number"
                    onChange={this.onChange}
                    className="validate"
                    label="Carpark Capacity"
                    labelClassName={center.carParkCapacity && 'active'}
                  />
                </div>
                <div className="row">
                  <div className={['input-field', 'col', 's12'].join(' ')}>
                    <MuiThemeProvider>
                      <SelectField
                        multiple
                        hintText="Select Facilities"
                        errorText={errors.facilities && <span className="red-text accent-1">{errors.facilities}</span>}
                        value={center.facilities && center.facilities}
                        fullWidth
                        onChange={this.onMultiSelect}
                      >
                        {this.menuItems(center.facilities)}
                      </SelectField>
                    </MuiThemeProvider>
                  </div>
                </div>
                <div className={['file-field', 'input-field', 's12'].join(' ')}>
                  <div className="btn">
                    <span>Center image</span>
                    <input type="file" name="image" onChange={this.onFileChange} accept="image/*" />
                  </div>
                  <div className="file-path-wrapper">
                    <input className={['file-path', 'validate'].join(' ')} type="text" placeholder={errors.image || 'upload image'} />
                  </div>
                </div>
                <Row className="center">
                  <button
                    className="btn waves-effect waves-light btn-large"
                    onClick={this.onSubmit}
                    disabled={
                      !center.name ||
                      !center.address ||
                      !center.carParkCapacity ||
                      !center.hallCapacity ||
                      !center.stateId ||
                      !center.price ||
                      !center.facilities ||
                      !center.image
                    }
                  >
                    Create
                  </button>
                  <button className="btn waves-effect waves-light red btn-large" onClick={this.goBack} style={{ marginLeft: '5px' }} >Back
                  </button>
                </Row>
              </div>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

UpdateCenterModal.propTypes = propTypes;
UpdateCenterModal.defaultProps = defaultProps;

const matchStateToProps = state => ({
  stateProps: {
    response: state.update
  }
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCenter: CenterActions.updateCenter,
  getCenters: CenterActions.getAll
}, dispatch);

export default connect(matchStateToProps, mapDispatchToProps)(UpdateCenterModal);
