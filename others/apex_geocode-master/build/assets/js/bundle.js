        // Add Listener
        document.getElementById('location-form').addEventListener('submit', geocode);
        document.getElementById('geolocation-form').addEventListener('click', latlng);
        //document.getElementById('location-input').addEventListener('keyup', address);
        //document.getElementById('geolocation-latitude').addEventListener('keydown', latlng);
        //document.getElementById('geolocation-longitude').addEventListener('keyup', latlng);
        document.getElementById('clean-form').addEventListener('click', function() {
          document.getElementById('formatted-address').innerHTML = '';
          document.getElementById('address-components').innerHTML = '';
          document.getElementById('geometry').innerHTML = '';
          document.getElementById('location-input').value = '';
          document.getElementById('geolocation-latitude').value = '';
          document.getElementById('geolocation-longitude').value = '';
        });

        // Call Geocode
        function geocode(e) {
          // Prevent actual submit
          e.preventDefault();

          var location = document.getElementById('location-input').value;

          var latitude = document.getElementById('geolocation-latitude').value;
          var longitude = document.getElementById('geolocation-longitude').value;

          console.log(location);
          console.log(latitude);
          console.log(longitude);
          var a = 1

          if (location.length > 0) {
            address();
          }
          else {
            latlng();
          }
        }

        function address() {
          var location = document.getElementById('location-input').value;
          axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                address: location,
                key: 'AIzaSyCjfoGPGBdjol-MAZoxx-vj8Hd1L2GTXDI'
              }
            })
            // Log full responce
            .then(out)
            .catch(function(error) {
              console.log(error);
            })
        }

        function latlng() {
          var latitude = document.getElementById('geolocation-latitude').value;
          var longitude = document.getElementById('geolocation-longitude').value;
          axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                latlng: latitude + ',' + longitude,
                key: 'AIzaSyCjfoGPGBdjol-MAZoxx-vj8Hd1L2GTXDI'
              }
            })
            // Log full responce
            .then(out)
            .catch(function(error) {
              console.log(error);
            })
        }

        function out(response) {
          // Log full response
          console.log(response);

          // Formatted Address
          var formattedAddress = response.data.results[0].formatted_address;
          var formattedAddressOutput = `
          <ul class="list-group">
            <li class="list-group-item">${formattedAddress}</li>
          </ul>
        `;

          // Address Components
          var addressComponents = response.data.results[0].address_components;
          var addressComponentsOutput = '<ul class="list-group">';
          for (var i = 0; i < addressComponents.length; i++) {
            addressComponentsOutput += `
            <li class="list-group-item"><strong>${addressComponents[i].types[0]}</strong>: ${addressComponents[i].long_name}</li>
          `;
          }
          addressComponentsOutput += '</ul>';

          // Geometry
          var lat = response.data.results[0].geometry.location.lat;
          var lng = response.data.results[0].geometry.location.lng;
          var geometryOutput = `
          <ul class="list-group">
            <li class="list-group-item"><strong>Latitude</strong>: ${lat}</li>
            <li class="list-group-item"><strong>Longitude</strong>: ${lng}</li>
          </ul>
        `;

          // Output to app
          document.getElementById('formatted-address').innerHTML = formattedAddressOutput;
          document.getElementById('geolocation-latitude').value = lat;
          document.getElementById('geolocation-longitude').value = lng;
          document.getElementById('location-input').value = formattedAddress;
          document.getElementById('address-components').innerHTML = addressComponentsOutput;
          document.getElementById('geometry').innerHTML = geometryOutput;
        }
        
//# sourceMappingURL=bundle.js.map
