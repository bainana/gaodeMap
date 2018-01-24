function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:{lat:-33.283333,lng:149.1},zoom:13}),infoWindow=new google.maps.InfoWindow,vm.locations().forEach(function(e){var n=new google.maps.Marker({position:e.position,map:map,title:e.name});n.addListener("click",function(){n.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){n.setAnimation(null)},2100),infoWindow.marker=n,infoWindow.setContent(getInfoWindowContent(e)),infoWindow.open(map,n)}),e.marker=n,requestAPIData(e)}),ko.applyBindings(vm)}function requestAPIData(e){var n="https://api.foursquare.com/v2/venues/"+e.foursquareID+"?client_id="+config.FOURSQUARE_CLIENT_ID+"&client_secret="+config.FOURSQUARE_CLIENT_SECRET+"&v=20170916";$.getJSON(n).done(function(n){n.response.venue.url&&(e.website=n.response.venue.url),n.response.venue.hours&&(e.hours=n.response.venue.hours.status)}).fail(function(){$("#foursquare-error").show()})}function getInfoWindowContent(e){var n="<h3>"+e.name+"</h3>";return n+="<div>"+e.address+"</div>",e.website?n+='<div><a target="_blank" href="'+e.website+'"> '+e.website+"</a></div>":n+="<div>Website URL is unknown</div>",e.hours?n+="<div>"+e.hours+"</div>":n+="<div>Opening hours are unknown</div>",n}var map,infoWindow,ViewModel=function(){var e=this;e.sidebarVisible=ko.observable(!1),e.locations=ko.observableArray(locations),e.search=ko.observable(""),e.filteredLocations=ko.computed(function(){if(""===e.search())return e.locations().forEach(function(e){e.marker&&e.marker.setVisible(!0)}),e.locations();var n=e.search().toLowerCase();return ko.utils.arrayFilter(e.locations(),function(e){var o=-1!==e.name.toLowerCase().indexOf(n);return e.marker&&e.marker.setVisible(o),o})}),e.clickLocation=function(e){google.maps.event.trigger(e.marker,"click")},e.sidebarToggle=function(){e.sidebarVisible(!e.sidebarVisible())}},vm=new ViewModel;