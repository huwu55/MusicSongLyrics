$(document).ready(function(){

    // Incoming Session Login & Search Data
    if ( sessionStorage.getItem("username") ) {
        user = sessionStorage.getItem("username");
        initializeUser();
    }
    if ( sessionStorage.getItem("song") && sessionStorage.getItem("artist") ) {
        var songName = sessionStorage.getItem("song");
        var musicianName = sessionStorage.getItem("artist");
        getLyrics(songName, musicianName);
    }
    // On-page Search, User presumed logged in
    $('.newsearch').on("click", function() {
        var isLoggedIn = sessionStorage.getItem("username");
        if (isLoggedIn) {
            var songName = $('#songName').val();
            var musicianName = $('#artist').val();
            getLyrics(songName, musicianName);
        } else {
            var songName = $('#songName').val();
            var musicianName = $('#artist').val();

            sessionStorage.setItem('artist', artist);
            sessionStorage.setItem('song', songName);
        }
    });

    //triggered when user selects a playlist
    $("#selectPlaylist").change(function(){
        displayPlaylist($(this).val());
        if($(this).val() !== "empty"){
            currentPlaylist = $(this).val();
        }
        else{
            currentPlaylist = "";
            console.log("Please selecte a playlist");
        }
    });

    // DELETE A SONG FROM A PLAYLIST
    $("#media").on("click", ".del", function(){
        // get the playlist name
        var playlistName = $("#selectPlaylist").val();
        var songTitle = $( this ).siblings(".songname").text();
        var artist = $( this ).siblings(".songwriter").text();
        console.log("Song title to delete is: ", songTitle, artist);
        deleteSong(playlistName, songTitle, artist);
    });

    $('.add2PL').on("click", function(){

        var radioGroup, plLabel, idVal, newline;
        var plists = getPlaylistNames();
        $("#add-song-modal").empty();

        if (plists.length === 0){
            $("#add-song-modal").text("You have not made any playlists yet.")
        } else {
        plists.forEach((list, count) => {
            list.toString().padStart(3, " ");
            idVal = "r" + count;
            radioGroup = $("<input>").attr({type: "radio", class: "plsradios", id: idVal, value: list, name: "playlist"});
            plLabel = $("<label>").attr("for", idVal).text(list).css("margin-left", "8px");
            newline = $("<br />");
            $("#add-song-modal").append(radioGroup).append(plLabel).append(newline);
            // if( count === plists.length - 1 ){
            //     idVal = "r" + plists.length;
            //     var createNewPL = $("<input>").attr({type: "radio", class: "plsradios", id: idVal, value: "create", name: "playlist"});
            //     var name = $("<input>").attr({type: "text", id: "newPLname", size: "300", placeholder: "Enter playlist name"}).css("margin-left", "8px");
            //     name.attr("id", "newPLname");
            //     console.log("TESTING NAME HERE ", name);
            //     $(".modal-body").append(createNewPL).append(name);
            // }
        });
        }
    });

    $('#addSongToPlaylist').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var modal = $(this);
        modal.find('.modal-title').text('Add favorite song ' + songName + ' to a playlist.');
    })

    $("#media").on("click", "#addSong2pl", function(){

        // var regex = /[\.\"\$\[\]\#\/]/g;
        // get playlist name
        var plname = $('input[name="playlist"]:checked').val();

        // var selectedPL = $("input[type=radio]:checked");
        // if( plname === "create" ) {
        //     var newPLname = $("input#newPLname").val().trim();
        //     console.log("The new playlist name entered is ", newPLname);
        //     if(newPLname === ""){
        //         alert("To create a new playlist, please enter a playlist name.");
        //     } else if (regex.test(newPLname)) {
        //         alert("Playlist names cannot contain special characters .$[]#/ so please enter a valid playlist name.");
        //     } else {
        //         addPlaylist(newPLname);
        //         addSong(plname, currentSong);
        //         $("#selectPlaylist").val(plname);
        //     }
        // } else {
            console.log("added song to playlist ", plname);
            addSong(plname, currentSong);
            $("#selectPlaylist").val(plname);
        // }
    });

    // Favorites heart icon hover
    $(".fa-heart").on("hover", function(){
        $(".fa-heart").removeClass("far")
        $(".fa-heart").addClass("fas");
    });
    $(".fav").on("click", function(){
        // change select to favorites
        $("#selectPlaylist").attr("selected", "selected");
        $("#selectPlaylist").val("Favorites");
        addSong("Favorites", currentSong);
    });
    // Create new playlist
    $("#createNewPL").on("click", function(){
        var regex = /[\.\"\$\[\]\#\/]/g;
        var newPLname = $(".input-group > input").val().trim();
        if(newPLname === ""){
            $('#validPlaylistName').modal();
            $(".input-group > input").val("");
        } else if (regex.test(newPLname)) {
            $('#validPlaylistName').modal();
            $(".input-group > input").val("");
        } else {
            $(".input-group > input").val("");
            addPlaylist(newPLname);
        }
    });

    // delete playlist MODAL
    $("i.fa-trash-alt").on("click", function(){
        var plname = $(this).siblings().val();
        if(plname !== "empty"){
            $(".modal-title").text(plname);
            var confirmation = $('#deletePlaylist').modal();
        }
    });

    // delete playlist CONFIRMATION trigger
    $("#media").on("click", "#deletePL", function(){
        var plname = $("#selectPlaylist").val().trim();
        if(plname !== "empty") deletePlaylist(plname);
    });

});