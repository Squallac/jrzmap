(function(){
    var infos=[];
    var log = console.log;
    var iconBase= 'https://maps.google.com/mapfiles/kml/shapes/';
    var map;
    var markers= [];	  
    var legend={}
    var firstRun = true;
    var icons=[];
    var flag = false;
    /*********************************************
             Start of global functions definitions
    ******************************************/
    function LoadJSON(){

	$.ajax({

            cache: false,
            url: 'https://api.mongolab.com/api/1/databases/jrzmap_database/collections/allData?apiKey=U4gwBm56TSzz77e07uOFZ0p8yG1edTTy',
            type: 'GET',
            dataType: 'json',

            success: function(vipData){
                icons= vipData[0];
                console.log(vipData[0].mercedes);



            },
            error: function(){
                console.log("Error while loading VIP data");

            }
        });
	
	return true;
    }
    


 	  /***** Start of the main function to initialize google maps ***********/
      function initialize(){

	  var mapCanvas = document.getElementById('map-canvas');
	  var mapOptions= { 
	      center: new google.maps.LatLng(31.675950, -106.426859),
	      zoom:12,
	      panControl:false,
	      scaleControl:false,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      styles:[
		  { "featureType": "landscape.man_made", 
		    "elementType": "geometry.fill", 
		    "stylers": [ { "weight": 0.4 }, 
				 { "color": "#aa88ad" } ] },
		  { "featureType": "poi.business", 
		    "elementType": "geometry.fill", 
		    "stylers": [ { "color": "#587fc8" } ] },
		  { "featureType": "poi", 
		    "elementType": "labels", 
		    "stylers": [ { "visibility": "off" } ] },
		  { "featureType": "landscape", 
		    "elementType": "labels.text", 
		    "stylers": [ { "visibility": "off" } ] }

	      ]
	       
	  }

	  var map = new google.maps.Map(mapCanvas, mapOptions);

	  /*******************************************
                 Start of function definitions
	   *******************************************/

	  
	  
	  

	  /*******************************************************************************
	   Function: mydataFix      
	   Arguments: data, vip 
	   Returns: NA
      	   Description: This function is for creating the value of position on the mydata 
           and icons objects       
           *******************************************************************************/	  	  
          function mydataFix(vip){

	     for(var key in vip){
		 var markerLatitude = parseFloat(icons[key].latitude);
		 var markerLongitude= parseFloat(icons[key].longitude);
		 var pos = new google.maps.LatLng(markerLatitude, markerLongitude);
		 icons[key].position = pos;
	     }
	  } 	  

	  /*******************************************************************************
	   Function: addMarket      
	   Arguments: feature 
	   Returns: marker, content, infoWindow
      	   Description: This function is for handling the markers, 
                        the marker positionates in the map with his custom icon,
                        an infowindow appears on clicking the marker, and closes if other
                        marker is active
      
           *******************************************************************************/

      
	  function addMarker(feature) {

	      var marker = new google.maps.Marker({
		  position: feature.position,
		  map: map,
		  icon: feature.icon
	      });
	      markers.push(marker);
	      var infoWindow= new google.maps.InfoWindow();
	      var content =  '<div class="infoWindow"><h4>'+feature.name + '</h4><br><b> Direccion: </b><br>' + feature.address+ '<br><br><b>Telefono </b><br><a href="+52656'+feature.phone + '">'+feature.phone+'</a><br><br><b>Website: <br></b><a target="_blank" href="'+ feature.website+'">Ir al sitio web</a></div>';
	      

	      google.maps.event.addListener(marker,'click',(function(marker,content,infoWindow){
		  return function(){

		      closeInfos();
		      infoWindow.setContent(content);
		      infoWindow.open(map,marker);
		      infos[0]=infoWindow;
		  };
	      })(marker,content,infoWindow));
	  }

	  /*******************************************************************************
	   Function: closeInfos      
	   Arguments: NA 
	   Returns: Special function to set infoWindows
      	   Description: This function is for handling the markers, 
                        the marker positionates in the map with his custom icon,
                        an infowindow appears on clicking the marker, and closes if other
                        marker is active
      
           *******************************************************************************/	  

	  function closeInfos(){
	  
	      if(infos.length > 0) {
		  infos[0].set("marker, null");
		  infos[0].close();
		  infos.length = 0;
	      }
	  }

	  /*******************************************************************************
	   Function: SchoolControl      
	   Arguments: controlDiv, map 
	   Returns: Special function which removes previous markers, and adds the markers of the 
           type 'school'
      	   Description: This function is for discriminating the markers, due the clicked control
           button 'Escuelas' of the UI      
           *******************************************************************************/	  	  
	  function SchoolControl(controlDiv, map){
	      
	      controlDiv.style.padding = '1px';
	      
	      var controlUI = document.createElement('div');
	      controlUI.style.textAlign = 'center';
	      controlUI.title = 'Elige solo las escuelas';
	      controlDiv.appendChild(controlUI);

	      //Set CSS for the control interior
	      var controlText = document.createElement('div');
	      controlText.style.fontFamily = 'Arial, sans-serif';
	      controlText.style.fontSize = '12px';
	      controlText.style.paddingLeft = '4px';
	      controlText.style.paddingRight = '4px';
	      controlText.innerHTML = '<button type="button" class="btn btn-danger btn-sm"> <b>Escuelas</b> </button>';
	      controlUI.appendChild(controlText);

	      //Setup the click event listeners
	      google.maps.event.addDomListener(controlUI,'click',function(){
		  
		  firstRun=false;
		  legend=[];
		  if(markers!=0){
		      for(var i=0; i<markers.length; i++){
			  markers[i].setMap(null);
		      }
		      markers=[];
		  }
		  for (var key in icons) {
		   if(icons[key].type === 'school'){
		       addMarker(icons[key]);
		       legend.push(icons[key]);
		       console.log(legend);
		   }else{/*Do nothing*/}
		  }
		  CreateLegend();
	      });
	  }

	  /*******************************************************************************
	   Function: FoodControl      
	   Arguments: controlDiv, map 
	   Returns: Special function which removes previous markers, and adds the markers of the 
           type 'gym'
      	   Description: This function is for discriminating the markers, due the clicked control
           button 'Gimnasios' of the UI      
           *******************************************************************************/	  	  
	  function FoodControl(controlDiv, map){
	      
	      controlDiv.style.padding = '1px';
	      
	      var controlUI = document.createElement('div');
	      controlUI.style.textAlign = 'center';
	      controlUI.title = 'Elige solo los negocios de alimentos';
	      controlDiv.appendChild(controlUI);

	      //Set CSS for the control interior
	      var controlText = document.createElement('div');
	      controlText.style.fontFamily = 'Arial, sans-serif';
	      controlText.style.fontSize = '12px';
	      controlText.style.paddingLeft = '4px';
	      controlText.style.paddingRight = '4px';
	      controlText.innerHTML = '<button type="button" class="btn btn-danger btn-sm"> <b>Alimentos</b> </button>';
	      controlUI.appendChild(controlText);

	      //Setup the click event listeners
	      google.maps.event.addDomListener(controlUI,'click',function(){
		  
		  firstRun=false;
		  legend=[];
		  if(markers!=0){
		      for(var i=0; i<markers.length; i++){
			  markers[i].setMap(null);
		      }
		      markers=[];
		  }
		  for (var key in icons) {
		   if(icons[key].type === 'food'){
		       addMarker(icons[key]);
		       legend.push(icons[key]);
		   }else{/*Do nothing*/}
		  }
		  CreateLegend();
	      });
	  }

	  /*******************************************************************************
	   Function: BusinessControl      
	   Arguments: controlDiv, map 
	   Returns: Special function which removes previous markers, and adds the markers of the 
           type 'business'
      	   Description: This function is for discriminating the markers, due the clicked control
           button 'Negocios' of the UI      
           *******************************************************************************/	  	  
	  function BusinessControl(controlDiv, map){
	      
	      controlDiv.style.padding = '1px';
	      
	      var controlUI = document.createElement('div');
	      controlUI.style.textAlign = 'center';
	      controlUI.title = 'Elige solo los negocios';
	      controlDiv.appendChild(controlUI);

	      //Set CSS for the control interior
	      var controlText = document.createElement('div');
	      controlText.style.fontFamily = 'Arial, sans-serif';
	      controlText.style.fontSize = '12px';
	      controlText.style.paddingLeft = '4px';
	      controlText.style.paddingRight = '4px';
	      controlText.innerHTML = '<button type="button" class="btn btn-danger btn-sm"> <b>Negocios</b> </button>';
	      controlUI.appendChild(controlText);

	      //Setup the click event listeners
	      google.maps.event.addDomListener(controlUI,'click',function(){
		  
		  firstRun=false;
		  legend=[];
		  if(markers!=0){
		      for(var i=0; i<markers.length; i++){
			  markers[i].setMap(null);
		      }
		      markers=[];
		  }
		  for (var key in icons) {
		   if(icons[key].type === 'business'){
		       addMarker(icons[key]);
		       legend.push(icons[key]);
		   }else{/*Do nothing*/}
		  }
		  CreateLegend();
	      });
	  }

	  /*******************************************************************************
	   Function: HealthControl      
	   Arguments: controlDiv, map 
	   Returns: Special function which removes previous markers, and adds the markers of the 
           type 'health'
      	   Description: This function is for discriminating the markers, due the clicked control
           button 'Salud' of the UI      
           *******************************************************************************/	  	  
	  function HealthControl(controlDiv, map){
	      
	      controlDiv.style.padding = '1px';
	      
	      var controlUI = document.createElement('div');
	      controlUI.style.textAlign = 'center';
	      controlUI.title = 'Elige solo los negocios de salud';
	      controlDiv.appendChild(controlUI);

	      //Set CSS for the control interior
	      var controlText = document.createElement('div');
	      controlText.style.fontFamily = 'Arial, sans-serif';
	      controlText.style.fontSize = '12px';
	      controlText.style.paddingLeft = '4px';
	      controlText.style.paddingRight = '4px';
	      controlText.innerHTML = '<button type="button" class="btn btn-danger btn-sm"> <b>Salud</b> </button>';
	      controlUI.appendChild(controlText);

	      //Setup the click event listeners
	      google.maps.event.addDomListener(controlUI,'click',function(){
		  
		  firstRun=false;
		  legend=[];
		  if(markers!=0){
		      for(var i=0; i<markers.length; i++){
			  markers[i].setMap(null);
		      }
		      markers=[];
		  }
		  for (var key in icons) {
		   if(icons[key].type === 'health'){
		       addMarker(icons[key]);
		       legend.push(icons[key]);
		   }else{/*Do nothing*/}
		  }
		  CreateLegend();
	      });
	  }



	  /*******************************************************************************
	   Function: OtherControl      
	   Arguments: controlDiv, map 
	   Returns: Special function which removes previous markers, and adds the markers of the 
           type 'other'
      	   Description: This function is for discriminating the markers, due the clicked control
           button 'Otros' of the UI      
           *******************************************************************************/	  	  
	  function OtherControl(controlDiv, map){
	      controlDiv.style.padding = '1px';
	      
	      var controlUI = document.createElement('div');
	      controlUI.style.textAlign = 'center';
	      controlUI.title = 'Elige otros negocios ';
	      controlDiv.appendChild(controlUI);

	      //Set CSS for the control interior
	      var controlText = document.createElement('div');
	      controlText.style.fontFamily = 'Arial, sans-serif';
	      controlText.style.fontSize = '12px';
	      controlText.style.paddingLeft = '4px';
	      controlText.style.paddingRight = '4px';
	      controlText.innerHTML = '<button type="button" class="btn btn-danger btn-sm"> <b> Otros</b> </button>';
	      controlUI.appendChild(controlText);

	      //Setup the click event listeners
	      google.maps.event.addDomListener(controlUI,'click',function(){
		  firstRun=false;
		  legend=[];
		  if(markers!=0){
		      for(var i=0; i<markers.length; i++){
			  markers[i].setMap(null);
		      }
		      markers=[];
		  }
		  for (var key in icons) {
		   if(icons[key].type === 'other'){
		       addMarker(icons[key]);
		       legend.push(icons[key]);

		   }else{/*Do nothing*/}
		  }
		  CreateLegend();

	      });
	  }


	  /*******************************************************************************
	   Function: AllControl      
	   Arguments: controlDiv, map 
	   Returns: Special function which removes previous markers, and adds all the markers
      	   Description: This function is for creating the markers, due the clicked control
           button 'Todos' of the UI      
           *******************************************************************************/	  	  
	  function AllControl(controlDiv, map){
	      controlDiv.style.padding = '1px';
	      
	      var controlUI = document.createElement('div');
	      controlUI.style.textAlign = 'center';
	      controlUI.title = 'Ver todos los negocios ';
	      controlDiv.appendChild(controlUI);

	      //Set CSS for the control interior
	      var controlText = document.createElement('div');
	      controlText.style.fontFamily = 'Arial, sans-serif';
	      controlText.style.fontSize = '12px';
	      controlText.style.paddingLeft = '4px';
	      controlText.style.paddingRight = '4px';
	      controlText.innerHTML = '<button type="button" class="btn btn-danger btn-sm"> <b> Todos</b> </button>';
	      controlUI.appendChild(controlText);

	      //Setup the click event listeners
	      google.maps.event.addDomListener(controlUI,'click',function(){
		  firstRun=false;
		  legend=[];
		  if(markers!=0){
		      for(var i=0; i<markers.length; i++){
			  markers[i].setMap(null);
		      }
		      markers=[];
		  }

		  for (var key in icons) {
		      if(key!=='_id'){
			  addMarker(icons[key]);
			  legend.push(icons[key]);
		      }

		  }
		  CreateLegend();
	      });
	  }

	  /*******************************************************************************
	   Function: CreateLegend      
	   Arguments: NA 
	   Returns: NA
      	   Description: This function is for creating the legends on the map on the right_bottom side of the screen
           *******************************************************************************/	  	  
	  function CreateLegend(){

	      var legends = document.getElementById('legend');

	      if(firstRun){
		  for (var key in icons) {
		      if(key!=='_id'&&icons[key].vip===true){
			  var type = icons[key];
			  var name = type.name;
			  var icon= type.icon;
			  var div = document.createElement('div');
			  div.innerHTML = '<img src="' + icon + '"> ' + name; 
			  legends.appendChild(div);
		      }
		  }

	      }else{
		  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop();
		  legends.innerHTML = '';

		  for(var i=0;i<legend.length;i++){
		      var type = legend[i];
		      var name = type.name;
		      var icon= type.icon;
		      var div = document.createElement('div');
		      div.innerHTML = '<img src="' + icon + '"> ' + name; 
		      legends.appendChild(div);

		  }
	      }
	      
	      
	      
	      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legends);

	  }


	  
	  var schoolControlDiv = document.createElement('div');
	  var schoolControl = new SchoolControl(schoolControlDiv,map);

	  schoolControlDiv.index = 1;
	  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(schoolControlDiv);

	  var foodControlDiv = document.createElement('div');
	  var foodControl = new FoodControl(foodControlDiv,map);

	  foodControlDiv.index = 2;
	  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(foodControlDiv);

	  var businessControlDiv = document.createElement('div');
	  var businessControl = new BusinessControl(businessControlDiv,map);

	  businessControlDiv.index = 3;
	  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(businessControlDiv);

	  var healthControlDiv = document.createElement('div');
	  var healthControl = new HealthControl(healthControlDiv,map);

	  healthControlDiv.index = 4;
	  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(healthControlDiv);

	  var otherControlDiv = document.createElement('div');
	  var otherControl = new OtherControl(otherControlDiv,map);

	  otherControlDiv.index = 5;
	  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(otherControlDiv);

	  var allControlDiv = document.createElement('div');
	  var allControl = new AllControl(allControlDiv,map);

	  allControlDiv.index = 6;
	  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(allControlDiv);



	  /***************************************************
		    Start of code
           ***************************************************/
	  if(icons!=''){ 
	      console.log('objects are not empty');
	      mydataFix(icons);
	      CreateLegend();
	      for (var key in icons) {
		  if(key!=='_id'&&icons[key].vip===true){
		      addMarker(icons[key]);
		  }

	      }
	  }else{
	      console.log('objects are empty');
	      window.location.reload();
	  }
	  


      }
      

    $(document).ajaxComplete(function(){
	console.log('complete');
	initialize();
    });
    
    LoadJSON();




    

})();
/********************************************************************
========================LOGS=========================================
RRR. 02/22/2015 Added window.onbeforeunload method for preventing the cache of the browser
RRR. 02/22/2015 Added window.onload function to refresh the entire page if the data is no loaded
RRR. 02/23/2015 Removed the window.onload function, added if else statement to check if the objects are empty.  
RRR. 03/26/2015 Implemented MongoDB ajax Request
RRR. 03/27/2015 Fully integrated MongoDB ajax Request in all button controllers, only one ajax Request used.


*******************************************************************/
