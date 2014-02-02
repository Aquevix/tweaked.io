//
//  Disquis-Lite - Inline comments via 100% Javascript/jQuery.
//
//  This script allows you to include comments in any static page,
//  by making GET and POST requests against the URL:
//
//      http://comments.tweaked.io/comments/ID
//
//  To use this script add the following to the head of your HTML:
//
//  // begin
//  <link rel="stylesheet" type="text/css" href="/css/c.css" media="screen" />
//  <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
//  <script src="/js/index.js" type="text/javascript"></script>
//  <script type="text/javascript">
//     $( document ).ready(function() {
//        discussion( "http://comments.tweaked.io/comments/id" );
//     });
//  </script>
//  // end
//
//
//  Once you've done that place a suitable DIV in your document body:
//
//    <div id="comments"></div>
//
//  et voila.
//
//  If comments are present they will be retrieved and displayed, otherwise
// the user will be able to add them.  The comments are formatted via CSS
// so you can change the look and feel easily, if you wish.
//
// Steve
// --
//


//
// Load the comments by making a JSONP request to the given URL.
//
// The comments will invoke the `comments(data)` function, when loaded.
//
function loadComments(url)
{
    $.ajax({
        url: url + "?callback=?",
        dataType:'jsonp',
        crossDomain:true,
	complete: (function(){populateReplyForm(url);})
    });
}


//
// Called when the JSONP data is loaded.
//
function comments(data)
{
    //
    // We're given a DIV with ID comments.  Empty it.
    //
    //
    $("#comments").html( "" );
    id = 1

    //
    // If there are some comments we should post a header.
    //
    if ( data.length > 0 )
    {
        $("#comments").prepend( "<h2>Comments</h2>");
    }

    $.each(data,function( key,val) {

        //
        //  The variables from the comment
        //
        var author = val["author"];
        var body   = val["body"];
        var ago    = val["ago"];

        $("#comments").append( "<div class=\"comment\"> \
<div class=\"link\"><a href=\"#comment_" + id + "\">#</a></div> \
<div class=\"title\"><a name=\"comment_" + id + "\">Author: " + author + "</a></div> \
<div class=\"tagline\">" + ago + "<br /></div> \
<div class=\"body\">" + body + "</div> \
</div>" );
	id += 1;
    });
}


//
// Generate the reply-form for users to add comments.
//
function populateReplyForm( url )
{
    //
    //  Once the comments are loaded we can populate the reply-area.
    //
    $("#comments").append("<div id=\"comments-reply\"></div>" );

    //
    //  This is unpleasant.
    //
    $("#comments-reply").html(" \
  <h2>Add Comment</h2> \
  <blockquote> \
<form method=\"POST\" id=\"myform\" action=\"\"> \
      <table> \
        <tr> \
          <td>Your Name</td> \
          <td><input type=\"text\" name=\"author\" /></td> \
        </tr> \
        <tr> \
          <td colspan=\"2\"><textarea name=\"body\" rows=\"5\" cols=\"50\"></textarea></td> \
        </tr> \
        <tr> \
          <td></td> \
          <td align=\"right\"><input type=\"submit\" value=\"Add Comment\"/></td> \
        </tr> \
      </table> \
    </form> \
  </blockquote> \
");

    //
    // Capture form-submissions.
    //
    $("#myform").bind( "submit",(function() {

        //
        // Hide the form when submitting.
        //
	$("#myform").hide();

        //
        // Send the POST
        //
	$.ajax({
            type: "POST",
            url: url,
            data: $("#myform").serialize(),
            error: function(r,e)
            {
		loadComments( url);
            },
            complete: function(r,e)
            {
		loadComments( url );
            },
            datatype: 'jsonp',
        })
        return false;
    }));

}

//
// Entry point.
//
// Assumes the URL specified can be used to GET/POST comments, and has
// the identifier associated with it already.
//
//  e.g. http://comments.tweaked.io/comments/apache
//
//
function discussion(  url )
{
    //
    //  Load the comments, and populate the <div id="comments"> area with them
    //
    loadComments( url )

}
