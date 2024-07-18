import React, { Component } from 'react';
import ReactCountryFlagsSelect from 'react-country-flags-select';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

class TestingAddressAPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
    };
    this.autocompleteRef = React.createRef();
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  handleCountrySelect(selectedCountry) {
    this.setState({ country: selectedCountry });
    console.log('Selected country:', selectedCountry);
  }

  handlePlaceChanged() {
    const place = this.autocompleteRef.current.getPlace();
    console.log('Selected address details:', place);
  }

  render() {
    return (
      <div>
        <div>TestingAddressAPI</div>

        <div className="centered-country-selector">
          <ReactCountryFlagsSelect
            onSelect={this.handleCountrySelect}
            optionsListMaxHeight={300}
            searchable
            selectWidth={500}
            selectHeight={40}
            className={`country-select`}
          />
        </div>

        <LoadScript googleMapsApiKey="YOUR_GOOGLE_API_KEY" libraries={libraries}>
          <Autocomplete
            onLoad={(ref) => (this.autocompleteRef.current = ref)}
            onPlaceChanged={this.handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="Enter your address"
              style={{ width: '500px', height: '40px', marginTop: '20px' }}
            />
          </Autocomplete>
        </LoadScript>
      </div>
    );
  }
}

export default TestingAddressAPI;
