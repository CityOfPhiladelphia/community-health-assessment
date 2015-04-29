      function main() {
        // add link to CartoDB viz.json here
        cartodb.createVis('map', 'https://lancona.cartodb.com/api/v2/viz/a8570d30-e90c-11e4-82cd-0e853d047bba/viz.json', {
            shareable: false ,
            title: false,
            description: false,
            search: true,
            tiles_loader: true,
            center_lat: 39.9694197,
            center_lon: -75.1614633,
            zoom: 9,
            cartodb_logo: false
        })
        .done(function(vis, layers  ) {
          // layer 0 is the base layer, layer 1 is cartodb layer
          // setInteraction is disabled by default
          layers[1].setInteraction(true);
          layers[1].on('featureClick', function(e, pos, latlng, data) {
            cartodb.log.log(e, pos, latlng, data);

            var sql = new cartodb.SQL({ user: 'lancona' });
            sql.execute("SELECT * FROM health_dashboard_districts WHERE cartodb_id = {{cartodb_id}}", data)
              .done(function(data) {
                var d = data.rows[0];
                var tpl = document.getElementById('sidebar-tpl').innerHTML;
                var output = Mustache.render(tpl, d);
                document.getElementById('stats').innerHTML = output;
                console.log(data.rows);
              })
              .error(function(errors) {
                // errors contains a list of errors
                console.log("errors:" + errors);
              })
          });
          // you can get the native map to work with it
          // depending if you use google maps or leaflet
          map = vis.getNativeMap();
          // now, perform any operations you need
          // map.setZoom(3)
          // map.setCenter(new google.maps.Latlng(...))
        })
        .error(function(err) {
          console.log(err);
        });
      }
      window.onload = main;