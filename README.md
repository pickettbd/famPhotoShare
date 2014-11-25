famPhotoShare
=============

DETAILS:
The app would enable family members (or any group for that matter) to share photos (initially; later we could include videos and audio tracks and other files like pdfs) easily and quickly.

Here’s my vision for the user experience.  A user logs in, selects a group, selects an event, and uploads photos.  The user waits (possibly a few days).  Eventually, all the other people in the group have done the same.  An email is sent to all the group members automatically telling them they have x number of days to download all (or a selected portion of their choosing) photos before they will be deleted.  The user gets back on the site and either (a) selects download all or (b) selects all the photos of their choosing and downloads the selected photos.  Everyone has all the pictures they wanted -- everyone is happy.  No-one inadvertently removed pictures from the Dropbox folder by dragging them into another folder on their Mac.

For this project, I’d like to allow photos to be uploaded and downloaded.  I want the download to be available as an all-in-one download AND by selecting desired thumbnails and clicking download.  Also, I’d like user accounts.  Initially, this would only be for a single group on a private website.

Of course this would have a REST api for scripting, third-party apps, mobile apps, etc., etc., etc...

Given enough time (i.e., probably not by the end of the semester unless we get tons of help or someone has an inordinate amount of time to devote), the following features could be added:
	-multi-group support (your fam, your friends who went to Disneyland with you, your CS360 lab6 group mates)
	-multi-event support (pictures from Christmas, the family vaca to Mexico, etc.)
	-sub-event categories
	-other file formats (video, audio, pdf, etc.)
	-preview functionality for the selected file
  
FRAMEWORK: node.js, Angular JS


